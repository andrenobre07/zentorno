import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { Users, Car, PlusCircle, List } from "lucide-react"; // Adicionado List

export default function AdminDashboard() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser?.isAdmin) {
      router.push("/");
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><p>A verificar permissões...</p></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Painel de Administrador</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card para Ver Utilizadores */}
          <Link href="/admin/utilizadores" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Gerir Utilizadores</h2>
            <p className="text-gray-600 mt-2">Ver todos os utilizadores registados no sistema.</p>
          </Link>

          {/* Card para Criar Carro */}
          <Link href="/admin/criar-carro" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center text-center">
            <PlusCircle className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Adicionar Carro</h2>
            <p className="text-gray-600 mt-2">Adicionar um novo veículo ao catálogo de vendas.</p>
          </Link>
          
          {/* --- NOVO CARD ADICIONADO AQUI --- */}
        
          <Link href="/admin/gerir-carros" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center text-center">
              <List className="w-12 h-12 text-purple-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Gerir Carros</h2>
              <p className="text-gray-600 mt-2">Editar ou eliminar carros existentes no catálogo.</p>
          </Link>

        </div>
      </section>
    </main>
  );
}