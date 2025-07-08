import { useState, useEffect } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Loader, ShoppingBag, Calendar } from 'lucide-react';

// Este componente recebe o ID de um utilizador e mostra o seu histórico
export default function HistoricoComprasUtilizador({ userId }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Se não recebermos um userId, não fazemos nada
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        // Query para ir buscar as compras do utilizador específico, ordenadas por data
        const q = query(
          collection(db, 'purchases'),
          where('userId', '==', userId),
          orderBy('purchaseDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userPurchases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Converte o Timestamp do Firebase para um objeto Date do JavaScript
          purchaseDate: doc.data().purchaseDate.toDate(),
        }));
        setPurchases(userPurchases);
      } catch (err) {
        console.error("Erro ao buscar histórico de compras:", err);
        setError("Não foi possível carregar o histórico de compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [userId]); // O useEffect corre sempre que o userId mudar

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin text-blue-500" />
        <span className="ml-2">A carregar histórico...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Compras</h3>
      {purchases.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <ShoppingBag className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-600">Este utilizador ainda não efetuou nenhuma compra.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <div key={purchase.id} className="bg-white rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
                <div>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {purchase.purchaseDate.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">ID: {purchase.purchaseId}</p>
                </div>
                <p className="font-bold text-xl text-blue-600">{purchase.amount.toFixed(2)}€</p>
              </div>
              <div>
                <ul className="space-y-1">
                  {purchase.products.map((product, index) => (
                    <li key={index} className="flex justify-between items-center text-sm text-gray-700">
                      <span>{product.name} (x{product.quantity})</span>
                      <span className="font-medium text-gray-800">{(product.amount).toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}