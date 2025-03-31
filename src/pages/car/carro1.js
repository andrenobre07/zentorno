// pages/car/carro1.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

export default function Carro1() {
  // State for all customization options
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedRims, setSelectedRims] = useState("standard");
  const [selectedSpoiler, setSelectedSpoiler] = useState("none");
  const [selectedTires, setSelectedTires] = useState("standard");
  const [viewAngle, setViewAngle] = useState("side");
  const [totalPrice, setTotalPrice] = useState(25000);
  
  // Pricing configuration
  const priceConfig = {
    basePrice: 25000,
    colors: { red: 0, blue: 500, black: 1000 },
    rims: { standard: 0, sport: 1200, premium: 2500 },
    spoilers: { none: 0, sport: 800, racing: 1500 },
    tires: { standard: 0, performance: 800, offroad: 1200 }
  };
  
  // Example of car images mapping
  const carImages = {
    red: {
      side: "/carro1-red-side.png",
      front: "/carro1-red-front.png",
      rear: "/carro1-red-rear.png",
    },
    blue: {
      side: "/carro1-blue-side.png",
      front: "/carro1-blue-front.png",
      rear: "/carro1-blue-rear.png",
    },
    black: {
      side: "/carro1-black-side.png",
      front: "/carro1-black-front.png",
      rear: "/carro1-black-rear.png",
    }
  };
  
  // Placeholder image for demo
  const getCarImage = () => {
    // In production, use the actual image paths
    return "/api/placeholder/800/400";
  };
  
  // Update total price when any option changes
  useEffect(() => {
    const newTotal = priceConfig.basePrice +
      priceConfig.colors[selectedColor] +
      priceConfig.rims[selectedRims] +
      priceConfig.spoilers[selectedSpoiler] +
      priceConfig.tires[selectedTires];
    
    setTotalPrice(newTotal);
  }, [selectedColor, selectedRims, selectedSpoiler, selectedTires]);
  
  // Handle form submission
  const handleSaveConfiguration = (e) => {
    e.preventDefault();
    // Here you would save the configuration or add to cart
    alert("Configuração salva! Total: €" + totalPrice.toLocaleString());
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">Modelo Sport GT</h1>
        <p className="text-center text-gray-600 mb-8">Personalize o carro dos seus sonhos</p>
        
        {/* Car Viewer Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Car Preview */}
            <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-800 to-gray-900 relative">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={selectedColor + viewAngle}
                className="p-8 flex justify-center items-center h-[400px]"
              >
                <img
                  src={getCarImage()}
                  alt="Carro Personalizado"
                  className="max-h-full object-contain"
                />
              </motion.div>
              
              {/* View Angle Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 flex space-x-4">
                <button 
                  onClick={() => setViewAngle("front")}
                  className={`text-white px-3 py-1 rounded-full ${viewAngle === "front" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                >
                  Frente
                </button>
                <button 
                  onClick={() => setViewAngle("side")}
                  className={`text-white px-3 py-1 rounded-full ${viewAngle === "side" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                >
                  Lateral
                </button>
                <button 
                  onClick={() => setViewAngle("rear")}
                  className={`text-white px-3 py-1 rounded-full ${viewAngle === "rear" ? "bg-blue-600" : "hover:bg-gray-700"}`}
                >
                  Traseira
                </button>
              </div>
            </div>
            
            {/* Configuration Panel */}
            <div className="w-full lg:w-1/3 p-6">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                Personalize seu Veículo
              </h2>
              
              {/* Pricing Information */}
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Preço Base:</span>
                  <span className="font-semibold">€{priceConfig.basePrice.toLocaleString()}</span>
                </div>
                
                {selectedColor !== "red" && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-700">Cor ({selectedColor}):</span>
                    <span className="font-semibold">€{priceConfig.colors[selectedColor].toLocaleString()}</span>
                  </div>
                )}
                
                {selectedRims !== "standard" && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-700">Jantes ({selectedRims}):</span>
                    <span className="font-semibold">€{priceConfig.rims[selectedRims].toLocaleString()}</span>
                  </div>
                )}
                
                {selectedSpoiler !== "none" && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-700">Spoiler ({selectedSpoiler}):</span>
                    <span className="font-semibold">€{priceConfig.spoilers[selectedSpoiler].toLocaleString()}</span>
                  </div>
                )}
                
                {selectedTires !== "standard" && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-700">Pneus ({selectedTires}):</span>
                    <span className="font-semibold">€{priceConfig.tires[selectedTires].toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-200">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-blue-700">€{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <form onSubmit={handleSaveConfiguration}>
                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Cor:</h3>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setSelectedColor("red")}
                      className={`w-12 h-12 rounded-full bg-red-600 border-4 transition-colors duration-300 ${
                        selectedColor === "red" ? "border-blue-600 ring-4 ring-blue-200" : "border-transparent"
                      }`}
                      title="Vermelho (+€0)"
                    ></button>
                    <button
                      type="button"
                      onClick={() => setSelectedColor("blue")}
                      className={`w-12 h-12 rounded-full bg-blue-600 border-4 transition-colors duration-300 ${
                        selectedColor === "blue" ? "border-blue-600 ring-4 ring-blue-200" : "border-transparent"
                      }`}
                      title="Azul (+€500)"
                    ></button>
                    <button
                      type="button"
                      onClick={() => setSelectedColor("black")}
                      className={`w-12 h-12 rounded-full bg-black border-4 transition-colors duration-300 ${
                        selectedColor === "black" ? "border-blue-600 ring-4 ring-blue-200" : "border-transparent"
                      }`}
                      title="Preto (+€1.000)"
                    ></button>
                  </div>
                </div>
                
                {/* Rims Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Jantes:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRims("standard")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedRims === "standard" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Standard
                      <div className="text-xs text-gray-500">+€0</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRims("sport")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedRims === "sport" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Sport
                      <div className="text-xs text-gray-500">+€1.200</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRims("premium")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedRims === "premium" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Premium
                      <div className="text-xs text-gray-500">+€2.500</div>
                    </button>
                  </div>
                </div>
                
                {/* Spoiler Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Spoiler:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSpoiler("none")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedSpoiler === "none" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Nenhum
                      <div className="text-xs text-gray-500">+€0</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSpoiler("sport")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedSpoiler === "sport" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Sport
                      <div className="text-xs text-gray-500">+€800</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSpoiler("racing")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedSpoiler === "racing" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Racing
                      <div className="text-xs text-gray-500">+€1.500</div>
                    </button>
                  </div>
                </div>
                
                {/* Tires Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Pneus:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTires("standard")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedTires === "standard" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Standard
                      <div className="text-xs text-gray-500">+€0</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTires("performance")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedTires === "performance" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Performance
                      <div className="text-xs text-gray-500">+€800</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTires("offroad")}
                      className={`p-2 text-sm rounded transition hover:bg-gray-100 ${
                        selectedTires === "offroad" ? "bg-blue-100 border border-blue-300" : "border"
                      }`}
                    >
                      Off-Road
                      <div className="text-xs text-gray-500">+€1.200</div>
                    </button>
                  </div>
                </div>
                
                {/* Save/Add to Cart Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                  >
                    Salvar Configuração
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Car Specs Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Especificações Técnicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Motor</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• 2.0L Turbo</li>
                <li>• 280 hp</li>
                <li>• 350 Nm torque</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Performance</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• 0-100 km/h: 5.8s</li>
                <li>• Velocidade máx: 250 km/h</li>
                <li>• Consumo: 7.2 L/100km</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Dimensões</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Comprimento: 4.8m</li>
                <li>• Largura: 1.9m</li>
                <li>• Altura: 1.4m</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Equipamento</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Ecrã tátil 10.1"</li>
                <li>• Sistema de navegação</li>
                <li>• Assistência à condução</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Car Gallery Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Galeria</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-100 rounded-lg overflow-hidden group relative cursor-pointer">
                <img 
                  src={`/api/placeholder/300/200`} 
                  alt={`Imagem ${num} do Carro`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Ver mais
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommended Accessories Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Acessórios Recomendados</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {name: "Kit Multimédia Premium", price: 1200},
              {name: "Tapetes Exclusivos", price: 150},
              {name: "Alarme Avançado", price: 350},
              {name: "Sensores de Estacionamento", price: 450}
            ].map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={`/api/placeholder/300/200`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-700 mb-3">€{item.price.toLocaleString()}</p>
                  <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}