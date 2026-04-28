import { auth} from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { populatePage } from "./postcard.js"
import { viewEnum, initPage, getPageCount, updatePageIndicator } from "./pagination.js"
import { navigateTo } from "./loadModule.js"; 

const postingsPerPage = 5;
let currentPage = 1;

onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        navigateTo("../index.html");
        return;
    }

    const totalPages = await getPageCount(postingsPerPage);
    await initPage(viewEnum.MY_POSTINGS, postingsPerPage, totalPages);

    document.body.style.visibility = "visible";
});

document.getElementById("postings-btn").addEventListener("click", () => {
    navigateTo("../postings.html");
});

document.getElementById("next-btn").addEventListener("click", async () => {
    const totalPages = await getPageCount(postingsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        await updatePageIndicator(postingsPerPage, currentPage, totalPages);
        await populatePage(viewEnum.MY_POSTINGS, postingsPerPage, currentPage, totalPages);
    }
});

document.getElementById("prev-btn").addEventListener("click", async () => {
    const totalPages = await getPageCount(postingsPerPage);
    if (currentPage > 1) {
        currentPage--;
        await updatePageIndicator(postingsPerPage, currentPage, totalPages);
        await populatePage(viewEnum.MY_POSTINGS, postingsPerPage, currentPage, totalPages);
    }
});