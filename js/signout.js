import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { navigateTo } from "./loadModule.js"; 

onAuthStateChanged(auth, (user) => {
  if (!user || !user.email.endsWith("@ucr.edu")) {
    localStorage.clear();
    navigateTo('../index.html');
    return;
  }
});

document.getElementById("signout-btn").addEventListener("click", () => {
  signOut(auth);
});