import { date } from "./utils.js"
import { db, auth } from "./firebase.js";
import { viewEnum } from "./pagination.js"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { navigateTo } from "./loadModule.js"; 

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
                </div>
                `
    }else{
        return  `
                <div class="card-header">
                    <span class="looking-for"><span style="color: rgb(234, 179, 60);">${data.role}</span> &#8226 Looking for a <span style="color: rgb(234, 179, 60);">${data.lookingFor}</span>!
                </div>
                <h3>${data.title}</h3>
        `
    }
}

function getDetails(data){
    const details = `
    <p class="card-description">${data.description}</p>\
    <p>Experience Lvl: ${data.experience}</p>
    `

    return details    
}


function getFooter(data, id, actions, uid){
    const postedBy = data.anon ? "Highlander" : data.postedBy;
    if(actions == headerButtonEnum.AUTHOR){
        return `
                <div class="card-footer">
                    <div class="card-actions">
                        <button class="edit-btn" onclick="navigateTo('submit.html?id=${id}')">Edit</button>
                        <button class="delete-btn" data-id="${id}">Del</button>
                    </div>
                    <div class="created-date"><p>${date(data.createdAt)}</p></div>  
                </div>
                `
    }else{
        return  `
                <div class="card-footer">
                    <button class="contact-btn" onclick="navigateTo('contact.html?uid=${uid}')">Contact</button>
                    <div class="created-date"><p>${postedBy} | ${date(data.createdAt)}</p></div>      
                </div>
        `
    }
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

    let q = null;
    if(view === viewEnum.MY_POSTINGS){
        q = query(
            collection(db, "postings"),
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
        );
    }else{
        q = query(
            collection(db, "postings"),
            orderBy("createdAt", "desc")
        );
    }

    const snapshot = await getDocs(q);
    const container = document.getElementById("postings-container");
    container.innerHTML = ""; // clear before re-rendering

    if(view === viewEnum.MY_POSTINGS){
        const addCard = document.createElement("div");
        addCard.classList.add("posting-card", "add-card");
        addCard.textContent = "+";
        addCard.onclick = () => navigateTo("submit.html");
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
            ${getFooter(data, docSnap.id, mode, data.uid)}
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

export { headerButtonEnum, populatePage }