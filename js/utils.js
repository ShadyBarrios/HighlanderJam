function date(timestamp){
    const date = timestamp.toDate();
    const formatted = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
    });

    return formatted
}

const headerButtonEnum = Object.freeze({
  CONTACT: 'CONTACT',
  AUTHOR: 'AUTHOR'
});

function getHeader(data, id, actions, uid){
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
    <span class="created-date">${date(data.createdAt)}</span>
    `

    return details    
}

export{date, headerButtonEnum, getHeader, getDetails }