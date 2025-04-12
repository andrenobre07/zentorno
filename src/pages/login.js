// pages/login.js
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication (replace with actual auth logic)
    setTimeout(() => {
      console.log("Login attempt with:", { email, password, rememberMe });
      setLoading(false);
      // Redirect to homepage or dashboard after successful login
      // router.push('/');
    }, 1500);
  };

  return (
    // Adicionei pt-24 para dar espaço no topo
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
      <Navbar />
      
      <section className="flex items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          {/* Lado esquerdo - Imagem com efeito de parallax */}
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
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#FFC107"                  />
                  <path d="M3.15302 7.3455L6.43851 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82801 4.1685 3.15302 7.3455Z"
                    fill="#FF3D00"                  />
                  <path                    d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                    fill="#4CAF50"                  />
                  <path                    d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#1976D2"                  />
                </svg>
                <span className="text-gray-700">Google</span>
              </button>
            </div>


              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continua com</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
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
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-800">
                      Esqueceste-te da senha?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    placeholder="Digita a tua senha"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </span>
                  ) : 'Entrar'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/registrar" className="text-blue-600 hover:text-blue-800 font-medium">
                    Registre-se
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
