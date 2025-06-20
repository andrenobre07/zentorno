import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../lib/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();
const storage = getStorage();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL,
    });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfilePicture(file) {
    if (!auth.currentUser) throw new Error("Nenhum utilizador autenticado para atualizar a foto.");
    
    const filePath = `profilePictures/${auth.currentUser.uid}/${file.name}`;
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);

    // --- ALTERAÇÃO AQUI ---
    // Usar auth.currentUser em vez de currentUser do estado
    await updateProfile(auth.currentUser, { photoURL: photoURL });
    
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, { photoURL: photoURL });

    setCurrentUser(prevUser => ({...prevUser, photoURL}));
    return photoURL;
  }

  async function updateUsername(newName) {
    if (!auth.currentUser) throw new Error("Nenhum utilizador autenticado.");
    if (!newName.trim()) throw new Error("O nome não pode estar vazio.");
    
    // --- ALTERAÇÃO AQUI ---
    // Usar auth.currentUser em vez de currentUser do estado
    await updateProfile(auth.currentUser, { displayName: newName });
    
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, { name: newName });

    setCurrentUser(prevUser => ({...prevUser, name: newName, displayName: newName}));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDocRef = doc(db, 'admins', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const [adminDocSnap, userDocSnap] = await Promise.all([
          getDoc(adminDocRef),
          getDoc(userDocRef)
        ]);
        const userData = userDocSnap.exists() ? userDocSnap.data() : {};
        setCurrentUser({
          ...user,
          name: userData.name || user.displayName,
          photoURL: userData.photoURL || user.photoURL,
          isAdmin: adminDocSnap.exists(),
        });
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
    updateUserProfilePicture,
    updateUsername,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}