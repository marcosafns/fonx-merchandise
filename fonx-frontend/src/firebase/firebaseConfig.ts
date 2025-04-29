// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAH2nL18rcQ9yMqVm0OsCVMGcRTDo8ENms",
    authDomain: "fonx-merchandise.firebaseapp.com",
    projectId: "fonx-merchandise",
    storageBucket: "fonx-merchandise.firebasestorage.app",
    messagingSenderId: "430229586028",
    appId: "1:430229586028:web:9b87643ebd267579215849"
  };

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
