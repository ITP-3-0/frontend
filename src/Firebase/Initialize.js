// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcH4mkX08OzIBXdqL_tLFgUfHjod1-yhU",
    authDomain: "e-guru-ticketing-system.firebaseapp.com",
    projectId: "e-guru-ticketing-system",
    storageBucket: "e-guru-ticketing-system.firebasestorage.app",
    messagingSenderId: "266086292515",
    appId: "1:266086292515:web:54d4a242644a44cb00a596",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
