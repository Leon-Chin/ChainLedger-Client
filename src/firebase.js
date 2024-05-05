// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtu9YfpEqcVpUbYshe3qUQog1k8tKUA8Q",
    authDomain: "chain-ledger.firebaseapp.com",
    projectId: "chain-ledger",
    storageBucket: "chain-ledger.appspot.com",
    messagingSenderId: "935245042202",
    appId: "1:935245042202:web:e30f4bcf366780cc2677a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app