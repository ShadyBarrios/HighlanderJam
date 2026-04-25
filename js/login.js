import { auth, provider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = '../postings.html';
    localStorage.setItem("firstName", user.displayName.split(" ")[0]);
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email.endsWith("@ucr.edu")) {
      await signOut(auth);
    }
  } catch (error) {
    console.error(error);
  }
});