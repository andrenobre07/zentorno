// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig'; // Certifique-se que o caminho para a sua configuração do Firebase está correto

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userData = {
          uid: user.uid,
          email: user.email,
          name: user.email.split('@')[0], // Fallback inicial para nome
          isAdmin: false // Assume que não é admin por padrão
        };

        // 1. Tenta buscar o nome do utilizador da coleção 'users'
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            userData.name = userDocSnap.data().name;
          }
        } catch (error) {
          console.error("Erro ao buscar nome do utilizador do Firestore:", error);
        }

        // 2. Verifica se o utilizador é um admin da coleção 'admins'
        try {
          const adminDocRef = doc(db, "admins", user.uid); // Procura por um documento com o UID do utilizador na coleção 'admins'
          const adminDocSnap = await getDoc(adminDocRef);
          userData.isAdmin = adminDocSnap.exists(); // Define isAdmin como true se o documento existir
        } catch (error) {
          console.error("Erro ao verificar status de admin:", error);
          userData.isAdmin = false; // Mantém como false em caso de erro
        }

        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <p className="text-center p-4 text-white">A carregar sessão...</p>}
    </AuthContext.Provider>
  );
};
