// src/pages/admin/utilizadores.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar'; // CORREÇÃO AQUI
import { Loader, Edit, Trash2, Shield, User, RefreshCw, ShieldCheck, ShieldOff, Camera, X } from 'lucide-react';

export default function GerirUtilizadores() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
        const adminDocRef = doc(db, 'admins', userDoc.id);
        const adminDocSnap = await getDoc(adminDocRef);
        return {
          id: userDoc.id,
          ...userDoc.data(),
          isAdmin: adminDocSnap.exists(),
        };
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Não foi possível carregar os utilizadores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser?.isAdmin) {
        router.push('/');
      } else {
        fetchData();
      }
    }
  }, [currentUser, authLoading, router, fetchData]);

  const handleToggleAdmin = async (userToToggle) => {
    if (userToToggle.id === currentUser?.uid) {
      alert("Não pode alterar o seu próprio estatuto de administrador.");
      return;
    }
    try {
      await fetch('/api/toggleAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userToToggle.id,
          makeAdmin: !userToToggle.isAdmin,
        }),
      });
      alert(`O estatuto de ${userToToggle.name} foi alterado com sucesso.`);
      fetchData();
    } catch (error) {
      console.error("Erro ao alterar papel do utilizador:", error);
      alert("Não foi possível alterar o papel do utilizador.");
    }
  };

  const handleDeleteUser = async (uid) => {
    if (uid === currentUser?.uid) {
      alert("Não pode eliminar a sua própria conta de administrador.");
      return;
    }
    if (window.confirm("Tem a certeza que quer eliminar este utilizador? Esta ação é PERMANENTE.")) {
      try {
        const idToken = await currentUser.getIdToken(true);
        const response = await fetch('/api/deleteUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, uidToDelete: uid }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        alert("Utilizador eliminado com sucesso.");
        fetchData();
      } catch (error) {
        console.error("Erro ao chamar a API de eliminação:", error);
        alert(`Não foi possível eliminar o utilizador: ${error.message}`);
      }
    }
  };
  
  const openPhotoModal = (user) => {
    setSelectedUser(user);
    setIsPhotoModalOpen(true);
    setUploadError('');
  };

  const closePhotoModal = () => {
    setSelectedUser(null);
    setIsPhotoModalOpen(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleUpdatePhoto = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedUser) return;

    if (!file.type.startsWith('image/')) {
        setUploadError('Por favor, selecione um ficheiro de imagem válido.');
        return;
    }
    
    setIsUploading(true);
    setUploadError('');

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    try {
      const base64Photo = await toBase64(file);
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        photoURL: base64Photo
      });

      setUsers(currentUsers => 
        currentUsers.map(u => 
          u.id === selectedUser.id ? { ...u, photoURL: base64Photo } : u
        )
      );
      
      closePhotoModal();

    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      setUploadError('Ocorreu um erro ao guardar a nova foto. Tente novamente.');
      setIsUploading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar /> {/* CORREÇÃO AQUI */}
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Gerir Utilizadores</h1>
          <button onClick={fetchData} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <RefreshCw size={18} />
            Atualizar Lista
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Utilizador</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Papel</th>
                <th className="p-4 font-semibold text-center">Tornar Admin</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={`Foto de ${user.name}`} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="text-gray-500" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        <Shield size={14} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                        <User size={14} /> Utilizador
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleAdmin(user)}
                      title={user.isAdmin ? "Remover como Admin" : "Tornar Admin"}
                      className={`p-2 rounded-full transition-colors ${user.id === currentUser?.uid ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={user.id === currentUser?.uid}
                    >
                      {user.isAdmin ? <ShieldOff className="text-red-500"/> : <ShieldCheck className="text-green-500"/>}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button 
                      onClick={() => openPhotoModal(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Alterar foto de perfil"
                    >
                      <Camera size={20} className="inline-block" />
                    </button>
                    <Link href={`/admin/editar-utilizador/${user.id}`} className="text-blue-600 hover:text-blue-800" title="Editar Nome">
                      <Edit size={20} className="inline-block" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className={`text-red-600 hover:text-red-800 ${user.id === currentUser?.uid ? 'cursor-not-allowed opacity-50' : ''}`}
                      title="Eliminar Utilizador"
                      disabled={user.id === currentUser?.uid}
                    >
                      <Trash2 size={20} className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isPhotoModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Alterar Foto de {selectedUser.name}</h3>
              <button onClick={closePhotoModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-4">Escolha uma nova imagem para o perfil.</p>
              
              <input 
                type="file"
                accept="image/*"
                onChange={handleUpdatePhoto}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isUploading}
              />
              
              {isUploading && (
                <div className="mt-4 flex items-center gap-2 text-blue-600">
                  <Loader className="animate-spin" size={16} />
                  <span>A guardar...</span>
                </div>
              )}
              
              {uploadError && (
                <p className="mt-4 text-sm text-red-600">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}