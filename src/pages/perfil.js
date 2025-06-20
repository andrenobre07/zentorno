import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, LogOut, Loader, ShieldCheck, Camera, Edit, X, Check } from 'lucide-react';

export default function Perfil() {
  const { currentUser, logout, loading, updateUserProfilePicture, updateUsername } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Estados para o upload da foto
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // --- NOVOS ESTADOS PARA A EDIÇÃO DO NOME ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
    // Preencher o estado do nome quando o utilizador for carregado
    if (currentUser) {
      setNewName(currentUser.name || '');
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        setUploadError('Por favor, selecione um ficheiro de imagem.');
        return;
    }

    setUploading(true);
    setUploadError('');
    try {
      await updateUserProfilePicture(file);
    } catch (err) {
      console.error("Erro ao fazer upload da foto:", err);
      setUploadError('Não foi possível fazer o upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // --- NOVA FUNÇÃO PARA GUARDAR O NOME ---
  const handleSaveName = async () => {
    if (!newName.trim()) {
        alert("O nome não pode ficar vazio.");
        return;
    }
    try {
        await updateUsername(newName.trim());
        setIsEditingName(false); // Sair do modo de edição
    } catch (error) {
        console.error("Erro ao atualizar o nome:", error);
        alert("Não foi possível atualizar o nome.");
    }
  };


  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full mb-4 group">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Foto de Perfil" className="w-full h-full rounded-full object-cover ring-4 ring-blue-200" />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-blue-200">
                  <User className="text-blue-600" size={64} />
                </div>
              )}
              <div 
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-all cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/png, image/jpeg, image/gif"/>
            </div>
            {uploading && <p className="text-sm text-blue-600">A carregar...</p>}
            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
            
            {/* --- LÓGICA DE EDIÇÃO DO NOME --- */}
            <div className="mt-4">
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.name || 'Utilizador'}</h1>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full">
                    <Edit size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-bold text-gray-900 bg-gray-100 border-b-2 border-blue-500 text-center focus:outline-none"
                  />
                  <button onClick={handleSaveName} className="text-green-500 hover:text-green-700 p-1 rounded-full">
                    <Check size={24} />
                  </button>
                   <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:text-red-700 p-1 rounded-full">
                    <X size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <Mail size={16} />
              <span>{currentUser.email}</span>
            </div>
            {currentUser.isAdmin && (
                <div className="flex items-center gap-2 mt-4 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                    <ShieldCheck size={16} />
                    <span>Conta de Administrador</span>
                </div>
            )}
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Minha Conta</h2>
            <p className="text-gray-700">Bem-vindo à sua área pessoal. Clique na sua foto para a alterar, ou no lápis para editar o seu nome.</p>
          </div>

          <div className="mt-8">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg transition-colors hover:bg-red-700">
              <LogOut size={18} />
              Terminar Sessão
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}