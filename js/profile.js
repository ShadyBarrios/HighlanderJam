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
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const container = document.getElementById("postings-container");

    // + card always first
    const addCard = document.createElement("div");
    addCard.classList.add("posting-card", "add-card");
    addCard.textContent = "+";
    addCard.onclick = () => window.location.href = "submit.html";
    container.appendChild(addCard);

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const card = document.createElement("div");
        const mode = user.uid == data.uid ? headerButtonEnum.AUTHOR : headerButtonEnum.CONTACT;
        card.classList.add("posting-card");
        card.innerHTML = `
        ${getHeader(data, docSnap.id, headerButtonEnum.AUTHOR)}
        ${getDetails(data)}
        `;

        card.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Delete this posting?")) {
            await deleteDoc(doc(db, "postings", docSnap.id));
            card.remove();
        }
        });

        container.appendChild(card);
    });

    document.body.style.visibility = "visible";
});

document.getElementById("postings-btn").addEventListener("click", () => {
    window.location.href = "../postings.html";
    return;
});