// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Buradaki değerleri Firebase Console'dan aldığın config ile doldur
const firebaseConfig = {
  apiKey: "AIzaSyDA7GqEFnvt2Pj0eIWnfRmPSJE3vrky5t8",
  authDomain: "lafkatweb.firebaseapp.com",
  projectId: "lafkatweb",
  storageBucket: "lafkatweb.firebasestorage.app",
  messagingSenderId: "1028324846947",
  appId: "1:1028324846947:web:c6daca07eccd19dce0f756"
};

// Firebase'i başlat
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
