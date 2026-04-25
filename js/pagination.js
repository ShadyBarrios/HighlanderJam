import { db } from './firebase.js'
import { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const POSTINGS_PER_PAGE = 4;
let currentPage = 1;
let totalPages = 1;
let lastVisible = null;

// get total count first
const countSnapshot = await getCountFromServer(collection(db, "postings"));
const totalDocs = countSnapshot.data().count;
totalPages = Math.ceil(totalDocs / POSTINGS_PER_PAGE);

updatePageIndicator();

function updatePageIndicator() {
  document.getElementById("page-indicator").textContent = `${currentPage} / ${totalPages}`;
}

document.getElementById("next-btn").addEventListener("click", async () => {
  currentPage++;
  await loadPostings("next");
  updatePageIndicator();
});

document.getElementById("prev-btn").addEventListener("click", async () => {
  currentPage--;
  await loadPostings("prev");
  updatePageIndicator();
});