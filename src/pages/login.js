// pages/login.js
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

// --- NOVAS IMPORTAÇÕES ---
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig"; // Certifique-se que o caminho está correto

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // <-- NOVO ESTADO PARA ERROS

  const router = useRouter(); // <-- INICIALIZAR ROUTER

  // --- FUNÇÃO HANDLESUBMIT ATUALIZADA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpar erros anteriores

    try {
      // Usar a função do Firebase para fazer login
      await signInWithEmailAndPassword(auth, email, password);
      
      // ALTERAÇÃO AQUI: Redireciona para a página anterior ou para a home
      const redirectUrl = router.query.redirect || '/';
      router.push(redirectUrl);

    } catch (err) {
      console.error("Erro de login:", err.code);
      // Tratar erros comuns
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos. Tente novamente.');
      } else {
        setError('Ocorreu um erro. Por favor, tente mais tarde.');
      }
    } finally {
      setLoading(false); // Parar o loading independentemente do resultado
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
      <Navbar />
      
      <section className="flex items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          {/* Lado esquerdo - Imagem (o seu código permanece igual) */}
          <div className="hidden md:block relative h-full min-h-[500px] bg-blue-800">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-60 z-10"></div>
              <img 
                src="/car-showroom.jpg" 
                alt="Luxury Car Showroom" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3";
                }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center p-12 z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white"
              >
                <h2 className="text-3xl font-bold mb-4">Encontra o teu carro ideal</h2>
                <p className="text-lg mb-6">Acessa a tua conta para explorar mais de 100 modelos exclusivos e personalizá-los ao teu estilo</p>
                <div className="flex gap-2 justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
                  <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Lado direito - Formulário */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
              <p className="mt-2 text-gray-600">Entra para explorar os nossos carros exclusivos</p>
            </div>
            
            <div className="space-y-6">
              {/* Botões de login social */}
              <div className="mb-6">
                   {/* ... O seu botão do Google fica aqui ... */}
              </div>
              
              <div className="relative">
                   {/* ... O seu divisor "Ou continua com" fica aqui ... */}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input de Email (código igual) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Digita o teu email" required />
                </div>
                
                {/* Input de Senha (código igual) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                    <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-800">Esqueceste-te da senha?</Link>
                  </div>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Digita a tua senha" required />
                </div>
                
                {/* Checkbox "Lembrar-me" (código igual) */}
                <div className="flex items-center">
                  <input type="checkbox" id="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Lembrar-me</label>
                </div>
                
                {/* --- MOSTRAR MENSAGEM DE ERRO AQUI --- */}
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
                
                {/* Botão de Submit (código igual) */}
                <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}>
                  {loading ? ( <span className="flex items-center justify-center">...</span> ) : 'Entrar'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600">Não tem uma conta?{' '} <Link href="/registrar" className="text-blue-600 hover:text-blue-800 font-medium">Registre-se</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}