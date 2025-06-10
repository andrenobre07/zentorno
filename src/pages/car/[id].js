import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Loader, AlertCircle, CheckCircle, Settings, Droplet, Car, Package } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CarDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true); // Loading da página inicial
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Loading específico para o botão
  const [error, setError] = useState(null);

  // State for price calculation
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedInterior, setSelectedInterior] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        setLoading(true);
        try {
          const carDocRef = doc(db, 'cars', id);
          const carDocSnap = await getDoc(carDocRef);

          if (carDocSnap.exists()) {
            const carData = { id: carDocSnap.id, ...carDocSnap.data() };
            setCar(carData);
            if (carData.colors && carData.colors.length > 0) setSelectedColor(carData.colors[0]);
            if (carData.interiors && carData.interiors.length > 0) setSelectedInterior(carData.interiors[0]);
            setTotalPrice(carData.preco);
          } else {
            setError("Carro não encontrado.");
          }
        } catch (err) {
          console.error("Erro ao buscar detalhes do carro:", err);
          setError("Não foi possível carregar os detalhes do carro.");
        }
        setLoading(false);
      };
      fetchCar();
    }
  }, [id]);

  useEffect(() => {
    if (!car) return;

    let newTotal = car.preco;
    if (selectedColor) newTotal += selectedColor.price;
    if (selectedInterior) newTotal += selectedInterior.price;
    selectedPackages.forEach(pkgName => {
        const packageData = car.packages.find(p => p.name === pkgName);
        if(packageData) newTotal += packageData.price;
    });

    setTotalPrice(newTotal);
  }, [car, selectedColor, selectedInterior, selectedPackages]);

  const handlePackageToggle = (packageName) => {
    setSelectedPackages(prev => 
        prev.includes(packageName) 
        ? prev.filter(p => p !== packageName)
        : [...prev, packageName]
    );
  };
  
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '€0,00';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // --- FUNÇÃO ATUALIZADA ---
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const carForCheckout = {
          ...car,
          totalPrice: totalPrice,
      };

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car: carForCheckout }),
      });

      // Verifica se a resposta da API foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar a sessão de pagamento.');
      }

      const session = await response.json();
      const stripe = await stripePromise;
      
      // Redirecionar para o checkout do Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Erro ao iniciar o pagamento: ${err.message}`);
    } finally {
      // Garante que o loading é desativado, quer haja sucesso ou erro
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center text-red-600">
            <AlertCircle className="w-12 h-12 mr-4" />
            <div>
                <h2 className="text-2xl font-bold">Erro</h2>
                <p>{error}</p>
            </div>
        </div>
        <Footer/>
      </main>
    );
  }

  if (!car) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Coluna Esquerda: Imagem e Títulos */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">{car.nome}</h1>
            <p className="text-xl text-gray-600">{car.tagline}</p>
            <img src={car.imagem} alt={car.nome} className="w-full rounded-xl shadow-2xl" />
          </div>

          {/* Coluna Direita: Configuração e Preço */}
          <div>
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-8 h-8 text-blue-600"/>
                <h2 className="text-3xl font-bold text-gray-900">Configure o Seu</h2>
              </div>
              
              <div className="space-y-6">
                {car.colors && car.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Droplet size={20}/>Cor Exterior</h3>
                    <div className="flex flex-wrap gap-3">
                        {car.colors.map(color => (
                            <button key={color.name} onClick={() => setSelectedColor(color)} className={`p-1 rounded-full transition-all ${selectedColor?.name === color.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} title={color.name}>
                                <div style={{ backgroundColor: color.hex }} className="w-8 h-8 rounded-full border border-gray-300"></div>
                            </button>
                        ))}
                    </div>
                    {selectedColor && <p className="text-sm mt-2 text-gray-600">{selectedColor.name} (+{formatPrice(selectedColor.price)})</p>}
                  </div>
                )}
                {car.interiors && car.interiors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Car size={20}/>Interior</h3>
                    <select onChange={(e) => setSelectedInterior(car.interiors.find(i => i.name === e.target.value))} className="w-full p-3 border rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500">
                        {car.interiors.map(interior => (
                            <option key={interior.name} value={interior.name}>{interior.name} (+{formatPrice(interior.price)})</option>
                        ))}
                    </select>
                  </div>
                )}
                {car.packages && car.packages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Package size={20}/>Pacotes Opcionais</h3>
                    <div className="space-y-3">
                        {car.packages.map(pkg => (
                            <label key={pkg.name} className="flex items-center p-4 bg-gray-50 rounded-lg border has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all cursor-pointer">
                                <input type="checkbox" onChange={() => handlePackageToggle(pkg.name)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                                <span className="ml-4 text-base font-medium text-gray-900">{pkg.name} <span className="text-gray-500">(+{formatPrice(pkg.price)})</span></span>
                            </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 border-t-2 border-dashed pt-6">
                <p className="text-lg text-gray-600">Preço Total Configurado:</p>
                <p className="text-5xl font-bold text-blue-700">{formatPrice(totalPrice)}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full mt-6 bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutLoading && <Loader className="w-6 h-6 animate-spin"/>}
                {checkoutLoading ? 'A Processar...' : 'Encomendar Agora'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold mb-4">Sobre o Veículo</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{car.descricao}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold mb-6">Especificações Técnicas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 text-lg">
                    {car.motor && <div className="space-y-1"><strong>Motor</strong><p className="text-gray-600">{car.motor}</p></div>}
                    {car.potencia && <div className="space-y-1"><strong>Potência</strong><p className="text-gray-600">{car.potencia}</p></div>}
                    {car.aceleracao && <div className="space-y-1"><strong>0-100 km/h</strong><p className="text-gray-600">{car.aceleracao}</p></div>}
                    {car.velocidadeMaxima && <div className="space-y-1"><strong>Vel. Máxima</strong><p className="text-gray-600">{car.velocidadeMaxima}</p></div>}
                    {car.consumo && <div className="space-y-1"><strong>Consumo</strong><p className="text-gray-600">{car.consumo}</p></div>}
                </div>
            </div>
            {car.features && car.features.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h3 className="text-3xl font-bold mb-6">Equipamento de Série</h3>
                    <ul className="list-none space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {car.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-lg text-gray-800">
                               <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"/>
                               <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
      <Footer />
    </main>
  );
}