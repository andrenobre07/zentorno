import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Adicionado updateProfile
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseConfig";

export default function Registrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [registrationError, setRegistrationError] = useState('');

  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setRegistrationError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Adicionar o nome ao perfil da Autenticação
      await updateProfile(user, { displayName: nome });

      // Guardar os dados no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: nome,
        email: email,
        uid: user.uid, // Importante para as regras que tínhamos antes
        createdAt: new Date().toISOString()
      });

      
      router.push('/');

    } catch (err) {
      console.error("Erro de registo:", err.code, err.message);
      let errorMessage = "Ocorreu um erro ao criar a conta. Tente novamente.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este endereço de email já está a ser utilizado.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca.';
      } else if (err.code === 'permission-denied' || err.code === 'missing-permission') {
        errorMessage = 'Erro de permissões na base de dados. Verifique as regras do Firestore.';
      }
      setRegistrationError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
      <Navbar />
      <section className="flex items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="hidden md:block relative h-full min-h-[600px] bg-blue-900">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-black/70 z-10"></div>
              <img src="/car-register.jpg" alt="Sports Car" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center p-12 z-20">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Junta-te à Zentorno</h2>
                <p className="text-lg mb-6">Cria a tua conta para personalizar e reservar os melhores carros premium do mercado</p>
              </motion.div>
            </div>
          </div>
          <div className="p-8 md:p-12 overflow-y-auto max-h-[700px]">
            <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Criar conta</h1><p className="mt-2 text-gray-600">Preenche os dados para te juntares à Zentorno</p></div>
            {registrationError && <p className="text-red-600 text-center mb-4">{registrationError}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${formErrors.nome ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`} placeholder="Digita o teu nome completo"/>
                {formErrors.nome && <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`} placeholder="Digita o teu email"/>
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10`} placeholder="Cria uma senha"/>
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                {formErrors.password ? <p className="mt-1 text-sm text-red-600">{formErrors.password}</p> : <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres.</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10`} placeholder="Confirma a tua senha"/>
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">Eu aceito os <a href="#" className="text-blue-600 hover:text-blue-800">Termos de Serviço</a> e a <a href="#" className="text-blue-600 hover:text-blue-800">Política de Privacidade</a></label>
                  {formErrors.terms && <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>}
                </div>
              </div>
              <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'}`}>
                {loading ? <span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processando...</span> : 'Criar conta'}
              </button>
            </form>
            <div className="mt-6 text-center"><p className="text-gray-600">Já tens uma conta?{' '}<Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Entrar</Link></p></div>
          </div>
        </div>
      </section>
    </main>
  );
}