import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

await addDoc(collection(db, "postings"), {
  title: "Looking for guitarist",
  description: "Need someone for Friday jam",
  postedBy: firstName,
  email: user.email,
  createdAt: serverTimestamp()
});