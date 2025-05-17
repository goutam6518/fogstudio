import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let gameName = document.getElementById("gameName");
let gameDes = document.getElementById("description");
let fileInput = document.getElementById("fileInput");
let logoInput = document.getElementById("logoInput");
let uploadBtn = document.getElementById("submitBtn");

let userId = "";
let gameCounts = 0;

// Create progress bar dynamically
const progressBarContainer = document.createElement("div");
progressBarContainer.style.display = "none";
progressBarContainer.style.width = "100%";
progressBarContainer.style.backgroundColor = "#f3f3f3";
progressBarContainer.style.borderRadius = "5px";
progressBarContainer.style.marginTop = "10px";

const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "20px";
progressBar.style.backgroundColor = "#4caf50";
progressBar.style.borderRadius = "5px";

progressBarContainer.appendChild(progressBar);
uploadBtn.parentNode.insertBefore(progressBarContainer, uploadBtn.nextSibling);

onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        getGameCounts();
    } else {
        console.log("No user is signed in.");
    }
});

document.getElementById('logoInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('logoPreview').src = e.target.result;
            console.log("Logo preview updated.");
        }
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        console.log('APK file selected:', file.name);
    }
});

uploadBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent page refresh

    if (userId) {
        const apkFile = fileInput.files[0];
        const iconFile = logoInput.files[0];

        if (gameName.value.length > 0 && gameDes.value.length > 0 && iconFile && apkFile) {
            uploadBtn.style.display = "none"; // Hide upload button
            progressBarContainer.style.display = "block"; // Show progress bar

            async function uploadFileWithProgress(file, storagePath) {
                const storageRef = ref(storage, storagePath);
                const uploadTask = uploadBytesResumable(storageRef, file);

                return new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            progressBar.style.width = progress + "%";
                            console.log(`Upload is ${progress}% done`);
                        },
                        (error) => {
                            console.error("Error uploading file:", error.code);
                            console.error("Error message:", error.message);
                            console.error("Full error details:", error);
                            reject(error);
                        },
                        async () => {
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadUrl);
                        }
                    );
                });
            }

            try {
                const sanitizedGameName = gameName.value.replace(/[^a-zA-Z0-9_-]/g, '_');
                const apkDownloadUrl = await uploadFileWithProgress(apkFile, `All_Games/Games/APK/${sanitizedGameName}.apk`);
                const iconDownloadUrl = await uploadFileWithProgress(iconFile, `All_Games/Games/Icons/${sanitizedGameName}.png`);

                await setDoc(doc(db, "GAMES", `${sanitizedGameName}`), {
                    name: gameName.value,
                    description: gameDes.value,
                    iconUrl: iconDownloadUrl,
                    apkUrl: apkDownloadUrl,
                    userId: userId,
                    gameId: gameCounts + 1
                });

                alert("Game uploaded successfully!");
            } catch (error) {
                console.error("Error uploading files:", error);
                alert("Failed to upload game. Please try again.");
            } finally {
                uploadBtn.style.display = "block";
                progressBarContainer.style.display = "none";
                progressBar.style.width = "0%";
            }
        } else {
            alert("Please fill all the fields and select both files.");
        }
    } else {
        alert("Please sign in to upload a game.");
    }
});

function getGameCounts() {
    const gamesCollectionRef = collection(db, "GAMES");

    getDocs(gamesCollectionRef)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                console.log(`Total games: ${querySnapshot.size}`);
                gameCounts = querySnapshot.size;
            } else {
                console.log("No games found in the collection.");
                gameCounts = 0;
            }
        })
        .catch((error) => {
            console.error("Error checking games collection:", error);
            gameCounts = 0;
        });
}
