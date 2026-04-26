import { db, auth, provider } from "./firebase.js";
import { getDisplayName } from "./utils.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.body.style.visibility = "visible";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const displayName = getDisplayName(user.displayName);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: displayName,
        email: user.email,
        uid: user.uid,
      });
    }

    localStorage.setItem("displayName", displayName);
    window.location.href = "postings.html";
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email.endsWith("@ucr.edu")) {
      alert("This website is only accessible through UCR signin.");
      await signOut(auth);
    }
  } catch (error) {
    console.error(error);
  }
});

////////////////////////////////
// Shady Was Here

// all audios
const audioIDs = ["WhipItAudio"]
// all audio playing statuses
var audioPlaying = {
    WhipItAudio: false
};
// when an audio is clicked
function toggleAudio(audioID){
    console.log("here")
    var audioPlayer = document.getElementById(audioID);
    // if audio is already playing, then pause it
    if(audioPlaying[audioID]){
        audioPlayer.pause();
        audioPlaying[audioID] = false;
    }
    else{ // if audio is not playing (yet), then pause all other audios and then play this one
        pauseAllAudios();
        audioPlayer.play();
        audioPlaying[audioID] = true;
    }
}
// pauses all audios
function pauseAllAudios(){
    var audioPlayer;
    for(const audioID of audioIDs){
        audioPlayer = document.getElementById(audioID);
        audioPlayer.pause();
    }
}