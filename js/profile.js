import { db, auth } from "./firebase.js";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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
    console.log('here')
    const snapshot = await getDocs(q);
    console.log('here2');
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
        card.classList.add("posting-card");
        card.innerHTML = `
        <div class="card-header">
            <h3>${data.title}</h3>
            <div class="card-actions">
            <button class="edit-btn" onclick="window.location.href='submit.html?id=${docSnap.id}'">✏️</button>
            <button class="delete-btn" data-id="${docSnap.id}">✕</button>
            </div>
        </div>
        <p>${data.description}</p>
        <span>${data.postedBy}</span>
        `;

        card.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Delete this posting?")) {
            await deleteDoc(doc(db, "postings", docSnap.id));
            card.remove();
        }
        });

        container.appendChild(card);
    });
});


document.getElementById("postings-btn").addEventListener("click", () => {
    window.location.href = "../postings.html";
    return;
});