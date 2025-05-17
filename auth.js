
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.firebasestorage.app",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:c222830b5404f87bf57e91",
    measurementId: "G-1JL82Z0FK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// logic code starting from here
let usernameTxt = document.getElementById('username');
let emailTxt = document.getElementById('email');
let passwordTxt = document.getElementById('password');
let loginBtn = document.getElementById('loginButton');
let kom = document.getElementById('komTxt');

let isOnSignUp = false;
usernameTxt.style.display = "none";

kom.addEventListener('click', function () {
    if (isOnSignUp) {
        isOnSignUp = false;
        loginBtn.textContent = "Login";
        kom.textContent = "Don't have an account? Sign up";
        usernameTxt.style.display = "none";
    } else {
        isOnSignUp = true;
        loginBtn.textContent = "Create";
        kom.textContent = "Already have an account ? Login";
        usernameTxt.style.display = "block";
    }
});

loginBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (isOnSignUp) {
        if (emailTxt.value != "" && passwordTxt.value != "" && usernameTxt.value != "") {
            // Show loading dialog
            let loadingDialog = document.createElement('div');
            loadingDialog.textContent = "Loading...";
            document.body.appendChild(loadingDialog);

            createUserWithEmailAndPassword(getAuth(app), emailTxt.value, passwordTxt.value)
                .then(async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user);
                    alert("Account created successfully");

                    // Upload user data to Firestore
                    const db = getFirestore(app);
                    await setDoc(doc(db, "USERS", user.uid), {
                        username: usernameTxt.value,
                        email: emailTxt.value,
                        password: passwordTxt.value,
                        id:user.uid
                    });

                    // Redirect to index.html
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    alert("Error: " + errorMessage);
                })
                .finally(() => {
                    // Remove loading dialog
                    document.body.removeChild(loadingDialog);
                });
        } else {
            alert("Please fill in all fields");
        }
    } else {
        // Logic for login
        if (emailTxt.value != "" && passwordTxt.value != "") {
            // Show loading dialog
            let loadingDialog = document.createElement('div');
            loadingDialog.textContent = "Loading...";
            document.body.appendChild(loadingDialog);

            const auth = getAuth(app);
            auth.signInWithEmailAndPassword(emailTxt.value, passwordTxt.value)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    alert("Login successful");

                    // Redirect to index.html
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    alert("Error: " + errorMessage);
                })
                .finally(() => {
                    // Remove loading dialog
                    document.body.removeChild(loadingDialog);
                });
        } else {
            alert("Please fill in all fields");
        }
    }
});
