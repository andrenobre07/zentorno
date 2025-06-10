// src/pages/admin/utilizadores.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar"; // Ajusta o caminho para Navbar
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react'; // Importa o ícone Loader

export default function Utilizadores() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // console.log("Auth Loading:", authLoading); // Para depuração
    // console.log("Current User:", currentUser); // Para depuração

    if (!authLoading) {
      if (!currentUser) {
        // console.log("Redirecionando para login: Não há utilizador."); // Para depuração
        router.push('/login');
      } else if (!currentUser.isAdmin) {
        // console.log("Redirecionando para home: Utilizador não é admin."); // Para depuração
        router.push('/');
        alert("Acesso negado. Apenas administradores podem ver esta página.");
      }
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (!authLoading && currentUser && currentUser.isAdmin) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          setError(null);

          const usersCollectionRef = collection(db, "users");
          const querySnapshot = await getDocs(usersCollectionRef);

          const usersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setUsers(usersList);
        } catch (err) {
          console.error("Erro ao buscar utilizadores:", err);
          setError("Não foi possível carregar os utilizadores. Tente novamente mais tarde.");
          if (err.code === 'permission-denied') {
            setError("Permissão negada. Verifique as regras do Firestore.");
          }
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [currentUser, authLoading]); // Dependências corrigidas para garantir que roda quando o currentUser está disponível

  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Verificando permissões...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-8">
      <Navbar />

      <section className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Utilizadores Registados</h1>

          {loadingUsers && (
            <div className="flex items-center justify-center text-blue-600">
              <Loader size={24} className="animate-spin mr-2" />
              A carregar utilizadores...
            </div>
          )}

          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          {!loadingUsers && !error && users.length === 0 && (
            <p className="text-gray-600 text-center">Nenhum utilizador registado encontrado.</p>
          )}

          {!loadingUsers && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Firebase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.id || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}