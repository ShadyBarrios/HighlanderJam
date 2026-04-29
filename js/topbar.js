const mediaQuery = window.matchMedia('(max-width: 767px)');

function updateTopBar(mediaQuery){
    const welcomeMsg = document.getElementById("welcome-msg").innerText;
    if(mediaQuery.matches){ // PHONE
        document.getElementById("top-bar").innerHTML = `
            <div id="top-bar-center">
                <h1 id="site-title" onclick="navigateTo('postings.html')" style="cursor: pointer;" id="title">Highlander <span style="color:rgb(234, 179, 60)">Jam</span></h1>
                <div id="top-bar-header">
                <p style="text-align:center"><span id="welcome-msg">${welcomeMsg}</span></p>
                <div id="buttons"><button id="signout-btn">Sign Out</button><span class="seperator">&#8226</span><button id="nav-btn"></button></div>
                </div>
            </div>
        `
        
        document.getElementById("top-bar").style = `
            grid-template-columns: 1fr;

            padding: 0.1em 0.75em;
        `
        document.getElementById("buttons").style=`
            display: flex;
            gap: 10px;
            align-items:center;
            justify-content:center;
        `
    }
    else{   // DESKTOP
        document.getElementById("top-bar").innerHTML = `
            <div id="top-bar-left">
                <span id="welcome-msg>${welcomeMsg}</span><span class="seperator">&#8226</span><button id="signout-btn">Sign Out</button>
            </div>

            <div id="top-bar-center">
                <h1 id="site-title" onclick="navigateTo('postings.html')" style="cursor: pointer;" id="title">Highlander <span style="color:rgb(234, 179, 60)">Jam</span></h1>
            </div>

            <div id="top-bar-right">
                <button class="nav-btn" id="nav-btn"></button>
            </div>
        `
        document.getElementById("top-bar").style = `
            grid-template-columns: 1fr 1fr 1fr;
            padding: 0.1em 0.75em;
        `
        document.querySelectorAll(".seperator").forEach(el => {
            el.style.cssText =  `
                padding: 0.6rem;
            `
        });
    }

}

mediaQuery.addEventListener('change', updateTopBar);
updateTopBar(mediaQuery);