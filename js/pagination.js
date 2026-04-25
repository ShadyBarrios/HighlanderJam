import { db } from './firebase.js'
import { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const POSTINGS_PER_PAGE = 6;
let currentPage = 0;
let totalPages = 0;
let postingCount = 0;
let lastVisible = null;

// get total count first
const countSnapshot = await getCountFromServer(collection(db, "postings"));
const totalDocs = countSnapshot.data().count;
totalPages = Math.ceil(totalDocs / POSTINGS_PER_PAGE);

function updatePageIndicator() {
  if(totalPages > 0){
    currentPage = 1;
    document.getElementById("page-indicator").textContent = `${currentPage} / ${totalPages}`;
  }
  else{
    document.getElementById("next-btn").style.visibility = "hidden";
    document.getElementById("prev-btn").style.visibility = "hidden";
    document.getElementById("page-indicator").textContent = "No postings are currently active..."
  }
}

function incrementPostingsCount() {
  postingCount++;
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

export { updatePageIndicator, incrementPostingsCount }