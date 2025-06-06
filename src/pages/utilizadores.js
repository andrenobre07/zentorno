// pages/utilizadores.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importe useRouter
import Navbar from "../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useAuth } from '../context/AuthContext'; // Importe useAuth

export default function Utilizadores() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // Renomeado para evitar conflito com 'loading' do AuthContext
  const [error, setError] = useState(null);

  const { currentUser, loading: authLoading } = useAuth(); // Obtém o utilizador atual e o estado de carregamento da autenticação
  const router = useRouter();

  // Efeito para verificar permissões do admin
  useEffect(() => {
    if (!authLoading) { // Só verifica depois que o estado de autenticação é carregado
      if (!currentUser) {
        router.push('/login'); // Redireciona para login se não estiver autenticado
      } else if (!currentUser.isAdmin) {
        // Se não for admin, redireciona para a home ou uma página de erro
        router.push('/');
        alert("Acesso negado. Apenas administradores podem ver esta página.");
      }
    }
  }, [currentUser, authLoading, router]); // Dependências do efeito

  // Efeito para buscar utilizadores (só se for admin)
  useEffect(() => {
    if (!authLoading && currentUser && currentUser.isAdmin) { // Só busca se não estiver a carregar a auth e for admin
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
          // Se for um erro de permissão, pode ser devido às regras do Firestore
          if (err.code === 'permission-denied') {
            setError("Permissão negada. Verifique as regras do Firestore.");
          }
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [currentUser, authLoading]); // Depende de currentUser e authLoading

  // Se a autenticação ainda está a carregar ou o utilizador não é admin (e está a ser redirecionado)
  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Verificando permissões...</p>
      </main>
    );
  }

  // Renderiza a página apenas se o utilizador for admin
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-8">
      <Navbar />

      <section className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Utilizadores Registados</h1>

          {loadingUsers && ( // Usa loadingUsers aqui
            <div className="flex items-center justify-center text-blue-600">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              A carregar utilizadores...
            </div>
          )}

          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          {!loadingUsers && !error && users.length === 0 && ( // Usa loadingUsers aqui
            <p className="text-gray-600 text-center">Nenhum utilizador registado encontrado.</p>
          )}

          {!loadingUsers && !error && users.length > 0 && ( // Usa loadingUsers aqui
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    {/* Pode adicionar mais colunas conforme as informações que guarda no Firestore */}
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
