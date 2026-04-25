import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


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

const db = getFirestore(app);

export { auth, provider, db };
