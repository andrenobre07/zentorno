// src/pages/admin/utilizadores.js

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../lib/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Importações necessárias
import Navbar from '../../components/Navbar';
import { Loader, Edit, Trash2, Shield, User, RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react';

export default function GerirUtilizadores() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // A função para buscar todos os dados dos utilizadores
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Buscar todos os utilizadores da coleção 'users'
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // 2. Para cada utilizador, verificar se ele existe na coleção 'admins'
      const usersList = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
        const adminDocRef = doc(db, 'admins', userDoc.id);
        const adminDocSnap = await getDoc(adminDocRef);
        return {
          id: userDoc.id,
          ...userDoc.data(),
          isAdmin: adminDocSnap.exists(), // A fonte da verdade para o papel
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
        // Se não for admin, não pode estar aqui
        router.push('/');
      } else {
        fetchData();
      }
    }
  }, [currentUser, authLoading, router, fetchData]);

  // --- O BOTÃO DE "TORNAR ADMIN" VOLTA A VIVER AQUI ---
  const handleToggleAdmin = async (userToToggle) => {
    if (userToToggle.id === currentUser?.uid) {
      alert("Não pode alterar o seu próprio estatuto de administrador.");
      return;
    }

    try {
      // Chama a nossa API fiável
      await fetch('/api/toggleAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userToToggle.id,
          makeAdmin: !userToToggle.isAdmin,
        }),
      });

      // --- A CORREÇÃO MÁGICA ---
      // Após a API ter sucesso, simplesmente chamamos a fetchData novamente.
      // Isto vai buscar a lista de utilizadores atualizada e redesenhar a tabela
      // com a informação correta, resolvendo o problema do "Papel" não atualizar.
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
        fetchData(); // Recarregar os dados aqui também
      } catch (error) {
        console.error("Erro ao chamar a API de eliminação:", error);
        alert(`Não foi possível eliminar o utilizador: ${error.message}`);
      }
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
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
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Papel</th>
                <th className="p-4 font-semibold text-center">Tornar Admin</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
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
                  <td className="p-4 text-right">
                    <Link href={`/admin/editar-utilizador/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-4" title="Editar">
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
    </main>
  );
}