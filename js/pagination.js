import { db } from './firebase.js';
import { collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { updatePage } from './profile.js';

const POSTINGS_PER_PAGE = 5;
let currentPage = 1;
let totalPages = 0;

const countSnapshot = await getCountFromServer(collection(db, "postings"));
const totalDocs = countSnapshot.data().count;
totalPages = Math.ceil(totalDocs / POSTINGS_PER_PAGE);

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