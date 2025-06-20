import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Loader, CheckCircle } from 'lucide-react';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Link para recuperação de senha enviado! Por favor, verifique o seu email (incluindo a pasta de spam).');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Nenhum utilizador encontrado com este endereço de email.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
      <Navbar />
      <section className="flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden p-8 md:p-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Recuperar Senha</h1>
                <p className="mt-2 text-gray-600">Não se preocupe, acontece!</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">O seu email de registo</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        placeholder="Digita o teu email" 
                        required 
                    />
                </div>
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
                {success && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 text-center">
                      <CheckCircle size={18}/>
                      <p>{success}</p>
                  </div>
                )}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
                >
                    {loading ? <span className="flex items-center justify-center">A enviar...</span> : 'Enviar Link de Recuperação'}
                </button>
            </form>
             <div className="mt-8 text-center">
                <p className="text-gray-600">Lembrou-se da senha?{' '} 
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Voltar ao Login
                    </Link>
                </p>
            </div>
        </div>
      </section>
    </main>
  );
}