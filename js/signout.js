import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user || !user.email.endsWith("@ucr.edu")) {
    localStorage.clear();
    window.location.href = '../index.html';
    return;
  }
});

document.getElementById("signout-btn").addEventListener("click", () => {
  signOut(auth);
});