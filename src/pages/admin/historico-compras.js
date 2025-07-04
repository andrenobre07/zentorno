// src/pages/admin/historico-compras.js

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import Navbar from '../../components/Navbar';
import { Loader, ShoppingBag } from 'lucide-react';

export default function AdminPurchaseHistory() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser?.isAdmin) {
        router.push('/'); // Redireciona se não for admin
      } else {
        const fetchOrders = async () => {
          setLoading(true);
          try {
            const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setOrders(ordersData);
          } catch (error) {
            console.error("Erro ao buscar encomendas:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchOrders();
      }
    }
  }, [currentUser, authLoading, router]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <ShoppingBag />
          Histórico de Todas as Compras
        </h1>
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Utilizador</th>
                <th className="p-4 font-semibold">Carro</th>
                <th className="p-4 font-semibold text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">
                    {order.orderDate ? new Date(order.orderDate.toDate()).toLocaleString('pt-PT') : '-'}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{order.userEmail}</td>
                  <td className="p-4 text-gray-700">{order.carName}</td>
                  <td className="p-4 text-right font-bold text-blue-700">{formatPrice(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}