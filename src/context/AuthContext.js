// src/context/AuthContext.js
"use client"; // Necessário para componentes do cliente no Next.js 13+

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile // Para adicionar o nome do utilizador
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Importa setDoc para adicionar dados do utilizador

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se o utilizador está autenticado, verifica se é admin e busca dados adicionais
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          let userDataFromFirestore = {};

          if (userDocSnap.exists()) {
            userDataFromFirestore = userDocSnap.data();
          }

          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          setCurrentUser({
            ...user,
            name: userDataFromFirestore.name || user.displayName || user.email.split('@')[0], // Prioriza nome do Firestore, depois displayName, depois parte do email
            isAdmin: adminDocSnap.exists() // Define isAdmin com base na existência do doc na coleção 'admins'
          });
        } catch (error) {
          console.error("Erro ao verificar status de admin ou dados do utilizador:", error);
          setCurrentUser({ ...user, name: user.displayName || user.email.split('@')[0], isAdmin: false }); // Assume não-admin em caso de erro
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adicionar o nome de exibição (display name) ao perfil do Firebase Auth
      await updateProfile(user, { displayName: name });

      // Guardar informações adicionais do utilizador na coleção 'users' do Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        createdAt: new Date().toISOString()
      });

      // Atualizar o estado do utilizador (incluindo o nome e isAdmin como false por padrão)
      setCurrentUser({ ...user, name: name, isAdmin: false });
      return user;
    } catch (error) {
      console.error("Erro no registo:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};