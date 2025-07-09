import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Loader } from 'lucide-react';

// --- A CORREÇÃO ESTÁ AQUI: Importamos 'auth' diretamente ---
import { auth } from '../lib/firebaseConfig';

// Carrega o Stripe fora do render para evitar recriá-lo
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState('');
    const [car, setCar] = useState(null);
    const [configuration, setConfiguration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Estado para guardar o erro

    useEffect(() => {
        // Quando a página carrega, vai buscar os dados que guardámos
        const storedCar = sessionStorage.getItem('checkoutCar');
        const storedConfig = sessionStorage.getItem('checkoutConfig');

        if (!storedCar || !storedConfig || !currentUser) {
            // Se não houver dados, volta para a página principal
            if (typeof window !== 'undefined') {
                router.push('/');
            }
            return;
        }

        const carData = JSON.parse(storedCar);
        const configData = JSON.parse(storedConfig);
        setCar(carData);
        setConfiguration(configData);

        const createPaymentIntent = async () => {
            try {
                // --- A CORREÇÃO ESTÁ AQUI: Usamos 'auth.currentUser' para obter o token ---
                if (!auth.currentUser) throw new Error("Utilizador não autenticado no Firebase.");
                const token = await auth.currentUser.getIdToken();
                // --------------------------------------------------------------------------

                const res = await fetch('/api/checkout_sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ car: carData, configuration: configData, token }),
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                    // Se a API retornar um erro, capturamo-lo aqui
                    throw new Error(data.error || 'Falha ao inicializar o pagamento.');
                }
                
                setClientSecret(data.clientSecret);

            } catch (err) {
                console.error("Erro em createPaymentIntent:", err);
                // Guardamos a mensagem de erro para mostrar ao utilizador
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        createPaymentIntent();
    // Adicionamos 'currentUser' ao array de dependências para ser mais robusto
    }, [currentUser, router]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0ea5e9', // Um azul, podes mudar
            colorBackground: '#ffffff',
            colorText: '#333333',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
        },
    };
    
    const options = {
        clientSecret,
        appearance,
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" size={48} /></div>;
    }

    // Se houver um erro, mostramos uma mensagem clara
    if (error) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 pt-24 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Ocorreu um Erro</h1>
                    <p className="text-gray-700 mb-6">Não foi possível iniciar o checkout. Por favor, tente novamente.</p>
                    <p className="text-sm text-gray-500 mb-6">Detalhe do erro: {error}</p>
                    <button onClick={() => router.back()} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Voltar</button>
                </div>
                <Footer />
            </main>
        );
    }


    return (
        // É AQUI QUE PODES COLOCAR O TEU FUNDO ANIMADO E ESTILOS
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Coluna da Esquerda: Resumo da Compra */}
                    {car && configuration && (
                         <div>
                            <h1 className="text-3xl font-bold mb-6">Resumo da Encomenda</h1>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <img src={car.imagem} alt={car.nome} className="w-full h-auto object-cover rounded-md mb-4" />
                                <h2 className="text-2xl font-semibold">{car.nome}</h2>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li><strong>Cor:</strong> {configuration.color.name}</li>
                                    <li><strong>Interior:</strong> {configuration.interior.name}</li>
                                    {configuration.packages.length > 0 && (
                                        <li><strong>Pacotes:</strong> {configuration.packages.join(', ')}</li>
                                    )}
                                </ul>
                                <div className="mt-6 border-t pt-4 text-2xl font-bold text-right">
                                    Total: {configuration.totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Coluna da Direita: Formulário de Pagamento */}
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Pagamento Seguro</h1>
                         {clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        ) : (
                            <p>A carregar formulário de pagamento...</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}