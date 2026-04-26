import { db, auth } from "./firebase.js";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { date, headerButtonEnum, getHeader, getDetails } from './utils.js';

onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        window.location.href = "../index.html";
        return;
    }
    await initPage();
    document.body.style.visibility = "visible";
});

async function initPage() {
    await updatePage(1);
}

async function updatePage(currPage) {
    const postingsPerPage = 5;
    const uid = auth.currentUser.uid;
    const q = query(
        collection(db, "postings"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const container = document.getElementById("postings-container");
    container.innerHTML = ""; // clear before re-rendering

    // + card always first
    const addCard = document.createElement("div");
    addCard.classList.add("posting-card", "add-card");
    addCard.textContent = "+";
    addCard.onclick = () => window.location.href = "submit.html";
    container.appendChild(addCard);

    const leftBound = (currPage - 1) * postingsPerPage;
    const rightBound = currPage * postingsPerPage;

    const currentPostings = snapshot.docs.slice(leftBound, rightBound);
    currentPostings.forEach((docSnap) => {
        const data = docSnap.data();
        const card = document.createElement("div");
        const mode = uid == data.uid ? headerButtonEnum.AUTHOR : headerButtonEnum.CONTACT;
        card.classList.add("posting-card");
        card.innerHTML = `
            ${getHeader(data, docSnap.id, headerButtonEnum.AUTHOR)}
            ${getDetails(data)}
        `;
        card.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Delete this posting?")) {
                await deleteDoc(doc(db, "postings", docSnap.id));
                card.remove();
                await refreshPage();
            }
        });
        container.appendChild(card);
    });
}

document.getElementById("postings-btn").addEventListener("click", () => {
    window.location.href = "../postings.html";
});

/// need to refactor but this'll make it work
import { getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const POSTINGS_PER_PAGE = 5;
let currentPage = 1;
let totalPages = 0;


let countSnapshot = await getCountFromServer(collection(db, "postings"));
let totalDocs = countSnapshot.data().count;
totalPages = Math.ceil(totalDocs / POSTINGS_PER_PAGE);

async function refreshPage(){
    countSnapshot = await getCountFromServer(collection(db, "postings"));
    totalDocs = countSnapshot.data().count;
    totalPages = Math.ceil(totalDocs / POSTINGS_PER_PAGE);

    if(currentPage > totalPages){
        currentPage = totalPages;
    }
    updatePageIndicator();
    await updatePage(currentPage);
}

function updatePageIndicator() {
    if (totalPages > 0) {
        document.getElementById("page-indicator").textContent = `${currentPage} / ${totalPages}`;
    } else {
        document.getElementById("next-btn").style.visibility = "hidden";
        document.getElementById("prev-btn").style.visibility = "hidden";
        document.getElementById("page-indicator").textContent = "No postings are currently active...";
    }
}

updatePageIndicator();

document.getElementById("next-btn").addEventListener("click", async () => {
    if (currentPage < totalPages) {
        currentPage++;
        updatePageIndicator();
        await updatePage(currentPage);
    }
});

document.getElementById("prev-btn").addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage--;
        updatePageIndicator();
        await updatePage(currentPage);
    }
});