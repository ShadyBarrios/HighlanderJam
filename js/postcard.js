import { date } from "./utils.js"
import { db, auth } from "./firebase.js";
import { viewEnum } from "./pagination.js"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const headerButtonEnum = Object.freeze({
  CONTACT: 'CONTACT',
  AUTHOR: 'AUTHOR'
});

function getHeader(data, id, actions, uid){
    // actions = headerButtonEnum.CONTACT;
    if(actions == headerButtonEnum.AUTHOR){
        return `
                <div class="card-header">
                    <h3>${data.title}</h3>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="window.location.href='submit.html?id=${id}'">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>    
                        </button>
                        <button class="delete-btn" data-id="${id}">✕</button>
                    </div>
                </div>
                `
    }else{
        return  `
                <div class="card-header">
                    <span>${data.postedBy} is looking for a <span style="color: rgb(234, 179, 60);">${data.lookingFor}</span>!
                    <div class="card-actions">
                        <button class="contact-btn" onclick="window.location.href='contact.html?uid=${uid}'">Contact</button>
                    </div>
                </div>
                <h3>${data.title}</h3>
        `
    }
}

function getDetails(data){
    const details = `
    <p>${data.description}</p>
    <br>
    <p>Instruments: ${data.instruments}</p>
    <p>Experience Lvl: ${data.experience}</p>
    <div class="created-date"><p>${date(data.createdAt)}</p></div>
    `

    return details    
}

async function refreshPage(postingsPerPage, currentPage, totalPages){
    if(!postingsPerPage || !currentPage){
        console.log("Missing args in refreshPage");
        return;
    }

    if(currentPage > totalPages){
        currentPage = totalPages;
    }

    await updatePageIndicator(postingsPerPage, currentPage, totalPages);
    await populatePage(postingsPerPage, currentPage);
}

async function populatePage(view, postingsPerPage, currentPage) {
    if(!view || !currentPage){
        console.log("Missing args in populatePage");
        return;
    }

    const uid = auth.currentUser.uid;
    const q = query(
        collection(db, "postings"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const container = document.getElementById("postings-container");
    container.innerHTML = ""; // clear before re-rendering

    if(view === viewEnum.MY_POSTINGS){
        const addCard = document.createElement("div");
        addCard.classList.add("posting-card", "add-card");
        addCard.textContent = "+";
        addCard.onclick = () => window.location.href = "submit.html";
        container.appendChild(addCard);
    }

    const leftBound = (currentPage - 1) * postingsPerPage;
    const rightBound = currentPage * postingsPerPage;

    const currentPostings = snapshot.docs.slice(leftBound, rightBound);
    currentPostings.forEach((docSnap) => {
        const data = docSnap.data();
        const card = document.createElement("div");
        const mode = uid == data.uid ? headerButtonEnum.AUTHOR : headerButtonEnum.CONTACT;
        // const mode = headerButtonEnum.CONTACT;
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
                await refreshPage(postingsPerPage, currentPage);
            }
        });
        }
        container.appendChild(card);
    });
}

export { headerButtonEnum, getHeader, getDetails, populatePage }