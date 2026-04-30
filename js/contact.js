import { db, provider, auth } from "./firebase.js";
import { getDisplayName } from "./utils.js";
import { collection, addDoc, getDoc, updateDoc, doc, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { navigateTo } from "./loadModule.js"; 

let post = null;
let tokenClient = null;
let accessToken = null;

const params = new URLSearchParams(window.location.search);
const postID = params.get("id");

const CLIENT_ID = "1001246148481-6t7o4ev2gato9eo0jb4s6mrre807a1i3.apps.googleusercontent.com";

let authRan = false;
onAuthStateChanged(auth, async (user) => {
  if (!user || !user.email.endsWith("@ucr.edu")) {
    localStorage.clear();
    navigateTo("../index.html");
    return;
  }
  authRan = true;
  await initPage();
  document.body.style.visibility = "visible";
});

document.getElementById("nav-btn").innerText = "To All Postings";

if (!authRan) {
  await initPage();
}

// Initialize the Gmail send-only token client once GSI is ready
window.addEventListener("load", () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/gmail.send",
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        alert("Authorization failed. Please try again.");
        return;
      }
      accessToken = tokenResponse.access_token;
      sendEmail(); // proceed after auth
    },
  });
});

document.getElementById("cancel-send-btn").addEventListener("click", () => navigateTo("../postings.html"));
document.getElementById("nav-btn").addEventListener("click", () => navigateTo("../postings.html"));

async function initPage() {
  const postDoc = await getDoc(doc(db, "postings", postID));
  if (postDoc.exists()) {
    post = postDoc.data();
    document.getElementById("form-title").textContent = post.postedBy
      ? `Send an email to ${post.postedBy}!`
      : "Send an email to this highlander!";
  } else {
    alert("There's been an error. Code WUT.");
    navigateTo("../index.html");
  }
}

document.getElementById("send-btn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const message = document.getElementById("message").value.trim();
  if (!message) {
    alert("Please enter a message.");
    return;
  }

  const confirmed = confirm(`Send this message to ${post.postedBy || "this highlander"}?`);
  if (!confirmed) return;

  try {
    // Add Gmail send scope to your existing UCR provider
    provider.addScope("https://www.googleapis.com/auth/gmail.send");

    // Re-uses the same UCR Google popup they already know
    const result = await signInWithPopup(auth, provider);

    // Extract the Gmail access token from the credential
    const credential = GoogleAuthProvider.credentialFromResult(result);
    accessToken = credential.accessToken;

    sendEmail();
  } catch (error) {
    console.error("Auth error:", error);
    alert("Authorization failed. Please try again.");
  }
});

function sendEmail() {
  let message = document.getElementById("message").value.trim();
  message = `
  <p>${message}</p>
  `
  const senderName = localStorage.getItem("displayName") || "A Highlander";
  const subject = `Highlander Jam: Message from ${senderName}`;
  const preface = `
    <div style="border-left: 4px solid #4285F4; padding-left: 15px; margin: 10px 0; color: #555;">
      ${post.title}<br>
      ${post.description}
    </div>
  `;


  // build RFC 2822 email string
  const emailLines = [
    `To: ${post.email}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    preface,
    message,
  ].join("\r\n");

  // Base64url encode it (required by Gmail API)
  const encoded = btoa(unescape(encodeURIComponent(emailLines)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: encoded }),
  })
    .then((res) => {
      if (res.ok) {
        navigateTo("../postings.html");
      } else {
        return res.json().then((err) => {
          console.error("Gmail API error:", err);
          alert("Failed to send email. Please try again.");
        });
      }
    })
    .catch((err) => {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    });
}