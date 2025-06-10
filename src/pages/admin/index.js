// src/pages/admin/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { Users, PlusCircle } from "lucide-react"; // Import icons

export default function AdminDashboard() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.push("/"); // Redireciona para home se não for um admin
      alert("Acesso negado. Apenas administradores podem aceder a esta página.");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Verificando permissões de administrador...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-8">
      <Navbar />
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Painel de Administrador</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/utilizadores" className="block">
              <div className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
                <Users size={48} className="mb-3" />
                <span className="text-xl font-semibold text-center">Ver Utilizadores</span>
                <p className="text-sm text-blue-100 mt-1 text-center">Gerir contas de utilizadores registados.</p>
              </div>
            </Link>

            <Link href="/admin/criar-carro" className="block">
              <div className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
                <PlusCircle size={48} className="mb-3" />
                <span className="text-xl font-semibold text-center">Criar Novo Carro</span>
                <p className="text-sm text-green-100 mt-1 text-center">Adicionar novos modelos ao catálogo.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}