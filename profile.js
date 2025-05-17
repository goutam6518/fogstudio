import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

//app logic starting from here

let userImg = document.getElementById('userImg');
let userName = document.getElementById('userName');
let followBtn = document.getElementById('followBtn');

const myUID = auth.currentUser.uid;

followBtn.addEventListener('click', async () => {
    if (user) 
    {
        
    }
});

