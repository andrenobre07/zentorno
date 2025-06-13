// pages/registrar.js
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Importando ícones para mostrar/ocultar senha

// --- IMPORTAÇÕES PARA FIREBASE E ROUTER ---
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Importa doc e setDoc para Firestore
import { auth, db } from "../lib/firebaseConfig"; // Certifique-se que o caminho está correto e que 'db' é exportado

export default function Registrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar a senha
  const [termsAccepted, setTermsAccepted] = useState(false); // Estado para os termos
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmar senha
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // Erros de validação do formulário
  const [registrationError, setRegistrationError] = useState(''); // Erro geral do Firebase

  const router = useRouter(); // Inicializa o router do Next.js

  const validateForm = () => {
    const errors = {};

    if (!nome.trim()) errors.nome = "Nome é obrigatório";

    if (!email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    if (!termsAccepted) {
      errors.terms = "Você precisa aceitar os termos e condições";
    }

    return errors;
  };

  const handleSubmit = async (e) => { // Tornar a função assíncrona
    e.preventDefault();
    setFormErrors({}); // Limpar erros anteriores
    setRegistrationError(''); // Limpa erros gerais

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // 1. Tenta criar o utilizador no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guarda o 'nome' e 'email' do utilizador na coleção 'users' do Firestore
      // O UID do utilizador é usado como ID do documento no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: nome,
        email: email,
        createdAt: new Date().toISOString() // Adiciona um timestamp de criação
      });

      // Redireciona para a página de login após o registo bem-sucedido
      router.push('/login');

    } catch (err) {
      console.error("Erro de registo:", err.code, err.message);
      // Mapear erros do Firebase para o seu estado de erros
      let errorMessage = "Ocorreu um erro ao criar a conta. Tente novamente.";
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este endereço de email já está a ser utilizado.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do email é inválido.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'O registo com email/password não está ativado no seu projeto Firebase. Verifique as configurações de autenticação.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Por favor, use uma mais forte.';
            break;
          case 'permission-denied':
            errorMessage = 'Permissão negada ao guardar os dados do utilizador. Verifique as regras do Firestore.';
            break;
          default:
            errorMessage = `Erro: ${err.message}`; // Mensagem mais genérica para outros erros
        }
      }
      setRegistrationError(errorMessage); // Define o erro para ser mostrado no UI
    } finally {
      setLoading(false);
    }
  };

  // As imagens de carro para o lado esquerdo
  const carImages = [
    "/car-register.jpg",
    "/sports-car.jpg",
    "/luxury-car.jpg"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
      <Navbar />

      <section className="flex items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          {/* Lado esquerdo - Imagem com efeito de parallax e texto */}
          <div className="hidden md:block relative h-full min-h-[600px] bg-blue-900">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-black/70 z-10"></div>
              <img
                src="/car-register.jpg"
                alt="Sports Car"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3";
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
                <h2 className="text-3xl font-bold mb-4">Junta-te à Zentorno</h2>
                <p className="text-lg mb-6">Cria a tua conta para personalizar e reservar os melhores carros premium do mercado</p>
                <div className="mt-12 flex flex-col items-center space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <ul className="text-left space-y-2">
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Lado direito - Formulário */}
          <div className="p-8 md:p-12 overflow-y-auto max-h-[700px]">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
              <p className="mt-2 text-gray-600">Preenche os dados para te juntares à Zentorno</p>
            </div>

            <div className="space-y-6">
            



              {/* Mensagem de erro geral do Firebase */}
              {registrationError && (
                <p className="text-red-600 text-center mb-4">{registrationError}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Nome completo */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.nome ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Digita o teu nome completo"
                  />
                  {formErrors.nome && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>
                  )}
                </div>

                {/* Campo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Digita o teu email"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Campo Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10`}
                      placeholder="Cria uma senha"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres, use letras e números para maior segurança</p>
                </div>

                {/* Campo Confirmar senha */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10`}
                      placeholder="Confirma a tua senha"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Checkbox de termos e condições */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      Eu aceito os <a href="#" className="text-blue-600 hover:text-blue-800">Termos de Serviço</a> e a <a href="#" className="text-blue-600 hover:text-blue-800">Política de Privacidade</a>
                    </label>
                    {formErrors.terms && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
                    )}
                  </div>
                </div>

                {/* Botão de submissão do formulário */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : 'Criar conta'}
                </button>
              </form>

              {/* Link para a página de login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Já tens uma conta?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Entrar
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
