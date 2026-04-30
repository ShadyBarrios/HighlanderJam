import { db, auth } from "./firebase.js";
import { collection, addDoc, getDoc, updateDoc, doc, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { navigateTo } from "./loadModule.js"

const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        navigateTo("../index.html");
        return;
    }

    await initPage();
});

function updateLookingFor(){
    const role = document.getElementById("role").value;
    if(role == "Musician"){
        document.getElementById("lookingFor").innerHTML = `
        <option value="musician">Musician</option>
        <option value="band">Band</option>
        <option value="jam session">Jam Sesh</option>
        `
    }
    else{
        document.getElementById("lookingFor").innerHTML = `
        <option value="musician">Musician</option>
        `
    }
}

async function initPage(){
    // if editing, prefill the form
    if (editId) {
        document.getElementById("form-title").textContent = "Edit Your Posting";
        document.getElementById("submit-btn").textContent = "Save";

        const docSnap = await getDoc(doc(db, "postings", editId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("role").value = data.role;
            document.getElementById("title").value = data.title;
            document.getElementById("description").value = data.description;
            // document.getElementById("instruments").value = data.instruments;
            document.getElementById("lookingFor").value = data.lookingFor;
            document.getElementById("experience").value = data.experience;
            document.getElementById("anon").checked = data.anon;
        }
    }
    else{
        document.getElementById("form-title").textContent = "Create New Posting";
    }

    updateLookingFor();
    document.body.style.visibility = "visible"; 
}

document.getElementById("role").addEventListener("change", () => updateLookingFor());

document.getElementById("cancel-btn").addEventListener("click", () => navigateTo("profile.html"));

document.getElementById("submit-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const role = document.getElementById("role").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const lookingFor = document.getElementById("lookingFor").value;
    // const instruments = document.getElementById("instruments").value.trim();
    const experience = document.getElementById("experience").value;
    const anon = document.getElementById("anon").checked;

    if (!title || !description) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        if (editId) {
            // update existing posting
            await updateDoc(doc(db, "postings", editId), {
                role,
                title,
                description,
                lookingFor,
                experience,
                anon
            });
            } 
        else {
            // create new posting
            await addDoc(collection(db, "postings"), {
                role,
                title,
                description,
                lookingFor,
                experience,
                anon,
                postedBy: localStorage.getItem("displayName"),
                email: user.email,
                uid: user.uid,
                createdAt: serverTimestamp()
            });
        }

        navigateTo("profile.html");
    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.error(error);
    }
});