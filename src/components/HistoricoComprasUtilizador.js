import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Loader, ShoppingBag, Calendar, Trash2 } from 'lucide-react';

export default function HistoricoComprasUtilizador({ userId, isAdminView = false }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'purchases'),
          where('userId', '==', userId),
          orderBy('purchaseDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userPurchases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
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
  }, [userId]);

  const handleDeletePurchase = async (purchaseId) => {
    if (!window.confirm("Tem a certeza que quer eliminar permanentemente este registo de compra?")) {
        return;
    }

    try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/deletePurchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, purchaseId }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ocorreu um erro na API.');
        }

        setPurchases(currentPurchases => currentPurchases.filter(p => p.id !== purchaseId));
        alert('Registo de compra eliminado com sucesso.');

    } catch (err) {
        console.error("Erro ao apagar compra:", err);
        alert(`Não foi possível apagar o registo: ${err.message}`);
    }
  };


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
                    {purchase.purchaseDate.toLocaleDateString('pt-PT')} às {purchase.purchaseDate.toLocaleTimeString('pt-PT')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">ID da Compra: {purchase.purchaseId}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-bold text-xl text-blue-600">{purchase.amount.toFixed(2)}€</p>
                    {isAdminView && (
                        <button 
                            onClick={() => handleDeletePurchase(purchase.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar este registo de compra"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
              </div>
              <div>
                <ul className="space-y-1">
                  {purchase.products.map((product, index) => (
                    // ########## ALTERAÇÕES FEITAS AQUI ##########
                    <li key={index} className="text-sm text-gray-700">
                      {/* 1. Removi o "(x{product.quantity})" */}
                      <span>{product.name}</span>
                      
                      {/* 2. O preço individual que aparecia à direita foi removido daqui. */}
                    </li>
                    // #############################################
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