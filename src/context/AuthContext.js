// src/context/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail // Adicionado para a funcionalidade de esqueci-senha
} from 'firebase/auth';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para criar/atualizar dados do utilizador no Firestore
  const updateUserInFirestore = async (user, additionalData = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const data = {
      uid: user.uid,
      email: user.email,
      name: additionalData.name || user.displayName, // Garante que o nome é preservado
      photoURL: additionalData.photoURL || user.photoURL, // Garante que a foto é preservada
      ...additionalData,
    };
    await setDoc(userRef, data, { merge: true });
    return data;
  };

  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Não é mais necessário o updateProfile aqui, pois o onAuthStateChanged trata disso
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUsername = async (name) => {
    if (auth.currentUser) {
      // Já não precisamos do updateProfile aqui, a API faz isso por nós
      const updatedData = await updateUserInFirestore(auth.currentUser, { name });
      setCurrentUser(prevUser => ({ ...prevUser, ...updatedData }));
    }
  };

  // --- FUNÇÃO CORRIGIDA PARA A FOTO DE PERFIL ---
  const updateUserProfilePicture = async (file) => {
    if (!auth.currentUser || !file) return;

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    try {
      const base64Photo = await toBase64(file);
      
      // A LINHA QUE CAUSAVA O ERRO FOI REMOVIDA.
      // Já não fazemos: await updateProfile(auth.currentUser, ...);

      // Apenas atualizamos o Firestore, que tem espaço suficiente
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: base64Photo
      });

      // Atualiza o estado local para refletir a mudança imediatamente
      setCurrentUser(prevUser => ({ ...prevUser, photoURL: base64Photo }));

    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
      throw new Error("Não foi possível atualizar a foto.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDocRef = doc(db, 'admins', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        
        const [adminDocSnap, userDocSnap] = await Promise.all([
          getDoc(adminDocRef),
          getDoc(userDocRef)
        ]);

        let combinedUser = {
          ...user, // Dados base do Auth (uid, email)
          ...(userDocSnap.exists() ? userDocSnap.data() : {}), // Dados do Firestore (nome, photoURL, etc.)
          isAdmin: adminDocSnap.exists(),
        };

        // Se o documento do utilizador não existir no Firestore, criamos um
        if (!userDocSnap.exists()) {
          const initialData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Novo Utilizador',
            photoURL: user.photoURL || null,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, initialData);
          combinedUser = { ...combinedUser, ...initialData };
        }
        
        setCurrentUser(combinedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUsername,
    updateUserProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}