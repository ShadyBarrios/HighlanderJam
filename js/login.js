import { db, auth, provider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.body.style.visibility = "visible";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName: user.displayName.split(" ")[0],
        email: user.email,
        uid: user.uid,
      });
    }

    localStorage.setItem("firstName", user.displayName.split(" ")[0]);
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