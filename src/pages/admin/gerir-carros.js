import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import { Loader, Edit, Trash2, Car, PlusCircle, AlertTriangle, Star } from 'lucide-react';

export default function GerirCarros() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !currentUser?.isAdmin) {
      router.push('/');
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollectionRef = collection(db, 'cars');
        const q = query(carsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const carsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(carsList);
      } catch (err) {
        console.error("Erro ao buscar carros:", err);
        setError("Não foi possível carregar os carros.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchCars();
    }
  }, [currentUser]);

  const handleDeleteCar = async (carId) => {
    if (window.confirm("Tem a certeza que quer eliminar este carro? Esta ação é irreversível.")) {
      try {
        await deleteDoc(doc(db, "cars", carId));
        setCars(cars.filter(car => car.id !== carId));
        alert("Carro eliminado com sucesso!");
      } catch (err) {
        console.error("Erro ao eliminar o carro:", err);
        alert("Ocorreu um erro ao eliminar o carro.");
      }
    }
  };

  const handleToggleFeatured = async (carId, currentStatus) => {
    const carDocRef = doc(db, "cars", carId);
    try {
      await updateDoc(carDocRef, {
        isFeatured: !currentStatus
      });
      setCars(cars.map(car => 
        car.id === carId ? { ...car, isFeatured: !currentStatus } : car
      ));
    } catch (err) {
      console.error("Erro ao alterar o status de destaque:", err);
      alert("Não foi possível alterar o status de destaque.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Gerir Carros</h1>
          <Link href="/admin/criar-carro" className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} />
            Adicionar Novo Carro
          </Link>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold mr-2"><AlertTriangle/></strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Nome do Carro</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold">Preço Base</th>
                <th className="p-4 font-semibold text-center">Destaque</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{car.nome}</td>
                  <td className="p-4 text-gray-600 capitalize">{car.categoria}</td>
                  <td className="p-4 text-gray-600">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(car.preco)}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggleFeatured(car.id, car.isFeatured)} title="Alterar Destaque">
                      <Star size={22} className={car.isFeatured ? "text-yellow-400 fill-current" : "text-gray-300"} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/editar-carro/${car.id}`} className="text-blue-600 hover:text-blue-800 mr-4" title="Editar">
                      <Edit size={20} className="inline-block" />
                    </Link>
                    <button onClick={() => handleDeleteCar(car.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                      <Trash2 size={20} className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && !error && (
            <div className="text-center p-8 text-gray-500">
                <Car size={48} className="mx-auto mb-2"/>
                <p>Nenhum carro encontrado no catálogo.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}