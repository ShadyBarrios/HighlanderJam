import { db, auth } from "./firebase.js";
import { collection, addDoc, getDoc, updateDoc, doc, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

let currentUser = null;
let recipient = null;
 
onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email.endsWith("@ucr.edu")) {
        localStorage.clear();
        window.location.href = "../index.html";
        return;
    }

    currentUser = user;

    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        recipient = userDoc.data();
        const firstName = recipient.firstName;
        if(firstName){
            document.getElementById("form-title").textContent  = `Send an email to ${firstName}!`;
        }
        else{
            document.getElementById("form-title").textContent = "Send an email to this highlander!";
        }
    }
    else{
        alert("There's been an error. Code WUT.")
        window.location.href = "../index.html";
        return;
    }

    document.body.style.visibility = "visible";
});

document.getElementById("cancel-send-btn").addEventListener("click", () => {
  window.location.href = "../postings.html";
});

document.getElementById("send-btn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const message = document.getElementById("message").value.trim();
  if (!message) {
    alert("Please enter a message.");
    return;
  }

  const subject = encodeURIComponent(`Highlander Jam: Message from ${localStorage.getItem("firstName")}`);
  const body = encodeURIComponent(message);

  window.location.href = "postings.html";
  window.open(`https://mail.google.com/mail/?view=cm&to=${recipient.email}&su=${subject}&body=${body}`, "_blank");
});
