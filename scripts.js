import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBEgglF-MlX_LSn8XjXoWDt9SdRsqoxQs",
    authDomain: "codex-12c1a.firebaseapp.com",
    databaseURL: "https://codex-12c1a-default-rtdb.firebaseio.com",
    projectId: "codex-12c1a",
    storageBucket: "codex-12c1a.appspot.com",
    messagingSenderId: "656317882947",
    appId: "1:656317882947:web:11c5818c595667099caaf6",
    measurementId: "G-X0QZNSZR60"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let userId = "";

onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        console.log("User is already in authenticated state:", userId);
    } else {
        console.log("No user is signed in.");
        alert("Please sign in to upload a game.").then(() => {
            window.location.href = "auth.html";
        });
    }
});