import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, LogOut, Loader, ShieldCheck, Edit, X, Check, KeyRound, Shield, Camera } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
// 1. Importar o nosso novo componente de histórico
import HistoricoComprasUtilizador from '../components/HistoricoComprasUtilizador';

export default function Perfil() {
  const { currentUser, logout, loading, updateUsername, updateUserProfilePicture } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
    if (currentUser) {
      setNewName(currentUser.name || currentUser.displayName || '');
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Falha ao terminar a sessão.");
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName.trim() === currentUser.name) {
      setIsEditingName(false);
      return;
    }
    try {
      await updateUsername(newName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Erro ao atualizar o nome:", error);
      alert("Falha ao atualizar o nome.");
    }
  };
  
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setUploadError('Por favor, selecione um ficheiro de imagem.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
        setUploadError('O ficheiro é demasiado grande. Limite de 5MB.');
        return;
    }

    setUploading(true);
    setUploadError('');

    try {
        await updateUserProfilePicture(file);
    } catch (error) {
        console.error("Erro ao carregar a foto:", error);
        setUploadError('Ocorreu um erro ao carregar a foto. Tente novamente.');
    } finally {
        setUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('As novas palavras-passe não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    const userToUpdate = auth.currentUser;
    if (!userToUpdate) {
        setPasswordError("Sessão inválida. Por favor, faça login novamente.");
        return;
    }

    setIsSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(userToUpdate.email, currentPassword);
      
      await reauthenticateWithCredential(userToUpdate, credential);
      await updatePassword(userToUpdate, newPassword);

      setPasswordSuccess('Palavra-passe alterada com sucesso!');
      
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);

    } catch (err) {
      console.error("Firebase Password Error:", err);
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'A palavra-passe atual está incorreta.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'A nova palavra-passe é demasiado fraca.';
      } else if (err.code) {
        errorMessage = `Erro: ${err.code}.`;
      }
      setPasswordError(errorMessage);
    } finally {
      setIsSavingPassword(false);
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
            {/* Secção da Foto de Perfil */}
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
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*"/>
            </div>
            {uploading && <p className="text-sm text-blue-600">A carregar...</p>}
            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
            
            <div className="mt-4">
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{newName || 'Utilizador'}</h1>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full"><Edit size={20} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="text-3xl font-bold text-gray-900 bg-gray-100 border-b-2 border-blue-500 text-center focus:outline-none" autoFocus />
                  <button onClick={handleSaveName} className="text-green-500 hover:text-green-700 p-1 rounded-full"><Check size={24} /></button>
                  <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:text-red-700 p-1 rounded-full"><X size={24} /></button>
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
            <h2 className="text-xl font-semibold mb-4">Segurança</h2>
            <button onClick={() => { setShowPasswordForm(!showPasswordForm); setPasswordError(''); setPasswordSuccess(''); }} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors hover:bg-gray-300">
              <KeyRound size={18} />
              {showPasswordForm ? 'Cancelar Alteração' : 'Alterar Palavra-passe'}
            </button>
            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700">Palavra-passe Atual</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Nova Palavra-passe</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Confirmar Nova Palavra-passe</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" required /></div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                <button type="submit" disabled={isSavingPassword} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                  {isSavingPassword ? <Loader size={20} className="animate-spin"/> : <Shield size={20}/>}
                  Guardar Nova Palavra-passe
                </button>
              </form>
            )}
          </div>
          <div className="mt-8"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg transition-colors hover:bg-red-700"><LogOut size={18} />Terminar Sessão</button></div>
        </div>

        {/* 2. SECÇÃO ADICIONADA: Histórico de Compras do Utilizador */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
          <HistoricoComprasUtilizador userId={currentUser.uid} />
        </div>

      </div>
      <Footer />
    </main>
  );
}