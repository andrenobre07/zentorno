import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { Loader, ShoppingBag, Calendar, User } from 'lucide-react';

export default function HistoricoAdmin() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUsersAndPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = {};
      usersSnapshot.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setUsers(usersData);

      const q = query(collection(db, 'purchases'), orderBy('purchaseDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const allPurchases = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data().purchaseDate.toDate(),
      }));
      setPurchases(allPurchases);

    } catch (error) {
      console.error("Erro ao buscar dados de administrador:", error);
      alert("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser?.isAdmin) {
        router.push('/');
      } else {
        fetchUsersAndPurchases();
      }
    }
  }, [currentUser, authLoading, router, fetchUsersAndPurchases]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Histórico de Compras Global</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Utilizador</th>
                <th className="p-4 font-semibold">Produtos</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 align-top">
                    <div className="text-sm text-gray-800 font-medium">
                      {purchase.purchaseDate.toLocaleDateString('pt-PT')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {purchase.purchaseDate.toLocaleTimeString('pt-PT')}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-2">
                       {users[purchase.userId]?.photoURL ? (
                          <img src={users[purchase.userId].photoURL} alt={`Foto de ${users[purchase.userId]?.name}`} className="w-8 h-8 rounded-full object-cover" />
                       ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={16} /></div>
                       )}
                       <div>
                         <p className="font-medium text-gray-900">{users[purchase.userId]?.name || 'Utilizador Removido'}</p>
                         <p className="text-xs text-gray-500">{purchase.userEmail}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <ul className="space-y-1 text-sm">
                      {purchase.products.map((p, i) => (
                        <li key={i} className="text-gray-600">
                          {p.quantity}x {p.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 text-right align-top font-bold text-lg text-blue-700">
                    {purchase.amount.toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {purchases.length === 0 && !loading && (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">Nenhuma compra registada na plataforma.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}