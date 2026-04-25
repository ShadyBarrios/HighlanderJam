import { db, auth } from "./firebase.js";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { date, headerButtonEnum, getHeader, getDetails } from './utils.js'

onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        window.location.href = "../index.html";
        return;
    }

    const q = query(
        collection(db, "postings"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const container = document.getElementById("postings-container");

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const mode = user.uid == data.uid ? headerButtonEnum.AUTHOR : headerButtonEnum.CONTACT;
        const card = document.createElement("div");
        card.classList.add("posting-card");
        card.innerHTML = `
        ${getHeader(data, docSnap.id, mode, data.uid)}
        ${getDetails(data)}
        `;

        if(mode == headerButtonEnum.AUTHOR){
            card.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Delete this posting?")) {
                await deleteDoc(doc(db, "postings", docSnap.id));
                card.remove();
            }
            });
        }

        container.appendChild(card);
    });
    document.body.style.visibility = "visible";
});

document.getElementById("profile-btn").addEventListener("click", () => {
    window.location.href = "../profile.html";
    return;
});