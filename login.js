import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJPqD829MZmOKiSAVaWXuVeqadxnWOJ48",
  authDomain: "highlander-jam.firebaseapp.com",
  projectId: "highlander-jam",
  storageBucket: "highlander-jam.firebasestorage.app",
  messagingSenderId: "1001246148481",
  appId: "1:1001246148481:web:6e049ad7d87414a0828a80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({ hd: "ucr.edu" });

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("member-area").style.display = "block";
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("member-area").style.display = "none";
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email.endsWith("@ucr.edu")) {
      await signOut(auth);
      document.getElementById("error-msg").style.display = "block";
    }
  } catch (error) {
    console.error(error);
  }
});

document.getElementById("signout-btn").addEventListener("click", () => {
  signOut(auth);
});