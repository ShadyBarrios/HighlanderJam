import { db } from "./firebase.js";
import { collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { populatePage } from "./postcard.js"

const viewEnum = Object.freeze({
    ALL_POSTINGS: 'ALL_POSTINGS',
    MY_POSTINGS: 'MY_POSTINGS'
})

async function initPage(view, postingsPerPage, totalPages) {
    await populatePage(view, postingsPerPage, 1);
    await updatePageIndicator(postingsPerPage, 1, totalPages);
}

async function getPageCount(postingsPerPage){
    if(!postingsPerPage){
        console.log("Missing arg in getPageCount");
        return;
    }

    const countSnapshot = await getCountFromServer(collection(db, "postings"));
    const totalDocs = countSnapshot.data().count;
    const totalPages = Math.ceil(totalDocs / postingsPerPage);
    return totalPages;
}

async function updatePageIndicator(postingsPerPage, currentPage, totalPages) {
    if(!postingsPerPage || !currentPage){
        console.log("Missing args in updatePageIndicator");
        return;
    }

    if (totalPages > 0) {
        document.getElementById("page-indicator").textContent = `${currentPage} / ${totalPages}`;
    } else {
        document.getElementById("next-btn").style.visibility = "hidden";
        document.getElementById("prev-btn").style.visibility = "hidden";
        document.getElementById("page-indicator").textContent = "No postings are currently active...";
    }
}

export { viewEnum, initPage, updatePageIndicator, getPageCount }