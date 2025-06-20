// /lib/firebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// --- IMPORTAÇÃO ADICIONADA ---
import { getStorage } from "firebase/storage"; 

// A sua configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaG3Ztc0pcVLv3mPygYgWdM5K2edpzkH0",
  authDomain: "zentorno-28263.firebaseapp.com",
  projectId: "zentorno-28263",
  storageBucket: "zentorno-28263.appspot.com",
  messagingSenderId: "888813878418",
  appId: "1:888813878418:web:30791fecbdfdd68620ba4b",
  measurementId: "G-D54X6JYHYZ"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// EXPORTAR AS CONSTANTES
export const db = getFirestore(app);
export const auth = getAuth(app);
// --- LINHA ADICIONADA ---
export const storage = getStorage(app);