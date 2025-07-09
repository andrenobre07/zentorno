import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import Navbar from '../../../components/Navbar';
import { Loader, User, Mail, AlertTriangle, ArrowLeft, Save } from 'lucide-react';
import HistoricoComprasUtilizador from '../../../components/HistoricoComprasUtilizador';


export default function EditarUtilizador() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id: userId } = router.query;

  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser?.isAdmin && userId) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = { id: userDocSnap.id, ...userDocSnap.data() };
          setUser(userData);
          setNewName(userData.name);
        } else {
          setError('Utilizador não encontrado.');
        }
        setPageLoading(false);
      };
      fetchUserData();
    } else if (!authLoading) {
      if (typeof window !== 'undefined') router.push('/');
    }
  }, [userId, currentUser, authLoading, router]);
  
  const handleUpdateUsername = async (e) => {
    e.preventDefault();

    if (newName.trim() === '' || newName === user.name) {
      alert("O novo nome não pode estar vazio ou ser igual ao nome atual.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/updateUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, newName: newName.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro na API.");
      }

      setUser(prevUser => ({ ...prevUser, name: newName.trim() }));
      alert(data.message);

    } catch (err) {
      console.error(err);
      alert(`Não foi possível atualizar o nome: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (pageLoading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }
  
  if (error) {
    return (
        <main className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <AlertTriangle className="text-red-500 mb-4" size={48} /> 
                <p className="text-red-500">{error}</p>
            </div>
        </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        {user && (
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="mb-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={20} />
                Voltar à Lista de Utilizadores
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 mr-3 text-blue-600"/>
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            </div>

            <p className="text-sm text-gray-500 mb-2">ID: {user.id}</p>
            <div className="flex items-center mb-8">
                <Mail className="w-5 h-5 mr-3 text-gray-500"/>
                <p className="text-base text-gray-700">{user.email}</p>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Alterar Nome de Utilizador</h2>
              <form onSubmit={handleUpdateUsername}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="Novo nome de utilizador"
                  />
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {isSaving ? <Loader size={20} className="animate-spin"/> : <Save size={20}/>}
                    {isSaving ? "A Guardar..." : "Guardar Alterações"}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t mt-8 pt-6">
              {/* Adicionamos a propriedade 'isAdminView' para mostrar os controlos de admin */}
              <HistoricoComprasUtilizador userId={userId} isAdminView={true} />
            </div>

          </div>
        )}
      </div>
    </main>
  );
}