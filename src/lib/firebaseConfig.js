// /lib/firebaseConfig.js (ou o nome que lhe deu)

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"; // É boa prática usar getApps e getApp no Next.js
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// O getAnalytics pode dar problemas no Server-Side Rendering, use com cuidado ou condicionalmente.

// Your web app's Firebase configuration
const firebaseConfig = {
  // As suas chaves aqui
  apiKey: "AIzaSyAaG3Ztc0pcVLv3mPygYgWdM5K2edpzkH0",
  authDomain: "zentorno-28263.firebaseapp.com",
  projectId: "zentorno-28263",
  storageBucket: "zentorno-28263.appspot.com", // Verifique se o seu é .appspot.com ou .firebasestorage.app
  messagingSenderId: "888813878418",
  appId: "1:888813878418:web:30791fecbdfdd68620ba4b",
  measurementId: "G-D54X6JYHYZ"
};

// Initialize Firebase de forma segura para o Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// EXPORTE AS CONSTANTES AQUI
export const db = getFirestore(app);
export const auth = getAuth(app);

// Não precisa exportar analytics a não ser que o vá usar noutro sítio
// const analytics = getAnalytics(app);