// pages/car/carro2.js (or carro3.js)
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function Carro2() {
  // Car specific data - modify this for each car model
  const carData = {
    id: "carro2", // Change to carro3 for the other file
    name: "Sedan Executivo", // Example name
    tagline: "Elegância e conforto em perfeita harmonia",
    basePrice: 32000,
    engine: "3.0L V6",
    power: "320 hp",
    acceleration: "5.2s (0-100 km/h)",
    topSpeed: "280 km/h",
    fuelConsumption: "8.4 L/100km",
    colors: [
      { id: "silver", name: "Prata Metálico", price: 0, hex: "#C0C0C0" },
      { id: "white", name: "Branco Pérola", price: 800, hex: "#F8F8FF" },
      { id: "darkblue", name: "Azul Noite", price: 1200, hex: "#191970" },
      { id: "burgundy", name: "Vinho Escuro", price: 1500, hex: "#800020" }
    ],
    interiors: [
      { id: "black", name: "Couro Preto", price: 0 },
      { id: "beige", name: "Couro Bege", price: 800 },
      { id: "brown", name: "Couro Castanho", price: 1200 }
    ],
    packages: [
      { 
        id: "comfort", 
        name: "Comfort Pack", 
        price: 2500,
        features: ["Bancos aquecidos", "Climatização de 3 zonas", "Vidros acústicos"]
      },
      { 
        id: "tech", 
        name: "Tech Pack", 
        price: 3800,
        features: ["Head-up display", "Sistema de som premium", "Assistência de estacionamento"]
      },
      { 
        id: "sport", 
        name: "Sport Pack", 
        price: 4500,
        features: ["Suspensão esportiva", "Volante esportivo", "Pedais em alumínio"]
      }
    ],
    features: [
      "Sistema de navegação",
      "Câmera 360°",
      "Controle de cruzeiro adaptativo",
      "Bancos elétricos com memória",
      "Conexão Bluetooth",
      "Carregador sem fio para smartphone",
      "Sistema de entrada sem chave",
      "Sensores de estacionamento"
    ]
  };
  
  // States for configuration
  const [selectedColor, setSelectedColor] = useState(carData.colors[0].id);
  const [selectedInterior, setSelectedInterior] = useState(carData.interiors[0].id);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [currentView, setCurrentView] = useState("exterior");
  
  // Calculate total price
  const calculateTotal = () => {
    let total = carData.basePrice;
    
    // Add color price
    const colorPrice = carData.colors.find(c => c.id === selectedColor)?.price || 0;
    total += colorPrice;
    
    // Add interior price
    const interiorPrice = carData.interiors.find(i => i.id === selectedInterior)?.price || 0;
    total += interiorPrice;
    
    // Add package prices
    carData.packages.forEach(pkg => {
      if (selectedPackages.includes(pkg.id)) {
        total += pkg.price;
      }
    });
    
    return total;
  };
  
  // Toggle package selection
  const togglePackage = (packageId) => {
    if (selectedPackages.includes(packageId)) {
      setSelectedPackages(selectedPackages.filter(id => id !== packageId));
    } else {
      setSelectedPackages([...selectedPackages, packageId]);
    }
  };
  
  // Get color object
  const getSelectedColor = () => carData.colors.find(c => c.id === selectedColor);
  
  // Get interior object
  const getSelectedInterior = () => carData.interiors.find(i => i.id === selectedInterior);
  
  // Get placeholder image based on view
  const getCarImage = () => {
    // In production, use actual images
    // return `/images/${carData.id}/${selectedColor}-${currentView}.jpg`;
    return "/api/placeholder/800/400";
  };
  
  // Format price with currency
  const formatPrice = (price) => {
    return `€${price.toLocaleString()}`;
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Car visualization */}
          <div className="lg:w-2/3">
            {/* Car header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold">{carData.name}</h1>
              <p className="text-xl text-gray-600">{carData.tagline}</p>
              <div className="mt-2">
                <span className="text-3xl font-bold text-blue-700">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            
            {/* Car image with view controls */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 relative">
                <div className="p-8 flex justify-center items-center h-[400px]">
                  <img
                    src={getCarImage()}
                    alt={`${carData.name} - ${getSelectedColor().name}`}
                    className="max-h-full object-contain"
                  />
                </div>
                
                {/* View angle controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 flex space-x-4">
                  <button 
                    onClick={() => setCurrentView("exterior")}
                    className={`text-white px-3 py-1 rounded-full ${currentView === "exterior" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                  >
                    Exterior
                  </button>
                  <button 
                    onClick={() => setCurrentView("interior")}
                    className={`text-white px-3 py-1 rounded-full ${currentView === "interior" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                  >
                    Interior
                  </button>
                  <button 
                    onClick={() => setCurrentView("details")}
                    className={`text-white px-3 py-1 rounded-full ${currentView === "details" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
              
              {/* Color selection */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">Cor:</h3>
                  <span className="text-gray-700">{getSelectedColor().name}</span>
                  {getSelectedColor().price > 0 && (
                    <span className="text-blue-700">(+{formatPrice(getSelectedColor().price)})</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {carData.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-10 h-10 rounded-full transition-colors duration-300 ${
                        selectedColor === color.id 
                          ? "ring-2 ring-offset-2 ring-blue-600" 
                          : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} ${color.price > 0 ? `(+${formatPrice(color.price)})` : ''}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Car specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Especificações</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-blue-700 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Motor</h3>
                  <p className="font-bold text-lg">{carData.engine}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-blue-700 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Potência</h3>
                  <p className="font-bold text-lg">{carData.power}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-blue-700 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">0-100 km/h</h3>
                  <p className="font-bold text-lg">{carData.acceleration}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-blue-700 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Consumo</h3>
                  <p className="font-bold text-lg">{carData.fuelConsumption}</p>
                </div>
              </div>
            </div>
            
            {/* Standard features */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Equipamento de Série</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Configuration panel */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                <h2 className="text-xl font-bold">Configurar {carData.name}</h2>
                <p className="text-sm opacity-80">Personalize o seu veículo</p>
              </div>
              
              <div className="p-6">
                {/* Interior selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Interior:</h3>
                  <div className="space-y-2">
                    {carData.interiors.map((interior) => (
                      <div 
                        key={interior.id}
                        onClick={() => setSelectedInterior(interior.id)}
                        className={`p-3 rounded-lg cursor-pointer transition duration-200 flex justify-between items-center ${
                          selectedInterior === interior.id 
                            ? "bg-blue-50 border border-blue-200" 
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 border ${
                            selectedInterior === interior.id ? "bg-blue-600 border-blue-600" : "border-gray-300"
                          }`}>
                            {selectedInterior === interior.id && (
                              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{interior.name}</span>
                        </div>
                        {interior.price > 0 && (
                          <span className="text-blue-700 font-medium">
                            +{formatPrice(interior.price)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Package selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Pacotes Opcionais:</h3>
                  <div className="space-y-4">
                    {carData.packages.map((pkg) => (
                      <div 
                        key={pkg.id}
                        className={`p-4 rounded-lg cursor-pointer transition duration-200 border ${
                          selectedPackages.includes(pkg.id) 
                            ? "bg-blue-50 border-blue-200" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => togglePackage(pkg.id)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 flex-shrink-0 rounded border ${
                              selectedPackages.includes(pkg.id) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                            }`}>
                              {selectedPackages.includes(pkg.id) && (
                                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 font-medium">{pkg.name}</span>
                          </div>
                          <span className="text-blue-700 font-medium">
                            +{formatPrice(pkg.price)}
                          </span>
                        </div>
                        <div className="pl-8 text-sm text-gray-600">
                          <ul className="list-disc pl-4">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Total price and buttons */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-700">{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200"
                      onClick={() => alert(`Configuração guardada! Total: ${formatPrice(calculateTotal())}`)}
                    >
                      Guardar Configuração
                    </button>
                    
                    <button 
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200"
                    >
                      Agendar Test Drive
                    </button>
                    
                    <Link 
                      href="/contacto" 
                      className="block text-center w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-200"
                    >
                      Falar com Vendedor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}