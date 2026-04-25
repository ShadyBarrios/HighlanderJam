import { db, auth } from "./firebase.js";
import { collection, addDoc, getDoc, updateDoc, doc, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

let currentUser = null;


onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        window.location.href = "../index.html";
        return;
    }

    currentUser = user;

    // if editing, prefill the form
    if (editId) {
        document.getElementById("form-title").textContent = "Edit Posting";
        document.getElementById("submit-btn").textContent = "Save";

        const docSnap = await getDoc(doc(db, "postings", editId));
        if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;
        document.getElementById("lookingFor").value = data.lookingFor;
        }
    }
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  window.location.href = "profile.html";
});

document.getElementById("submit-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const lookingFor = document.getElementById("lookingFor").value;
    const instruments = document.getElementById("instruments").value.trim();

    if (!title || !description || !instruments) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        if (editId) {
        // update existing posting
        await updateDoc(doc(db, "postings", editId), {
            title,
            description,
            instruments,
            lookingFor,
        });
        } else {
        // create new posting
        await addDoc(collection(db, "postings"), {
            title,
            description,
            instruments,
            lookingFor,
            postedBy: localStorage.getItem("firstName"),
            email: user.email,
            uid: user.uid,
            createdAt: serverTimestamp()
        });
        }

        window.location.href = "profile.html";
    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.error(error);
    }
});