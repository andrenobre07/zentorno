// pages/car/carro1.js
import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function Carro1() {
  // Controla a etapa atual
  // 1 = Informações do carro
  // 2 = Personalização
  // 3 = Resumo/Compra
  const [step, setStep] = useState(1);

  // ---------------------------
  // ETAPA 1: INFORMAÇÕES
  // ---------------------------
  // Removemos as animações de KM e HP
  // e deixamos apenas as informações fixas (preço, velocidade, aceleração).
  const price = 150000; // Exemplo
  const topSpeed = 320; // km/h
  const acceleration = 3.5; // 0-100 km/h em 3.5s

  const goToCustomization = () => {
    setStep(2);
  };

  // ---------------------------
  // ETAPA 2: PERSONALIZAÇÃO
  // ---------------------------
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedWheels, setSelectedWheels] = useState(null);
  const [selectedSpoiler, setSelectedSpoiler] = useState(null);
  const [selectedTires, setSelectedTires] = useState(null);

  // Mapeamento de imagens conforme a cor escolhida
  const carImages = {
    red: "/carro1-red.png",
    blue: "/carro1-blue.png",
    black: "/carro1-black.png",
  };

  // Verifica se todas as opções foram selecionadas
  const isComplete =
    selectedColor && selectedWheels && selectedSpoiler && selectedTires;

  const goToSummary = () => {
    if (isComplete) {
      setStep(3);
    } else {
      alert("Por favor, selecione todas as opções de personalização.");
    }
  };

  // ---------------------------
  // ETAPA 3: RESUMO/COMPRA
  // ---------------------------
  const finishPurchase = () => {
    alert("Compra finalizada! Obrigado pela preferência.");
  };

  // ---------------------------
  // RENDERIZAÇÃO
  // ---------------------------
  return (
    <main>
      <Navbar />

      {/* ETAPA 1: INFORMAÇÕES DO CARRO */}
      {step === 1 && (
        <section className="py-16 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Carro 3 - Informações</h1>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xl">
                <strong>Preço:</strong> R$ {price.toLocaleString()}
              </p>
              <p className="text-xl">
                <strong>Velocidade Máxima:</strong> {topSpeed} km/h
              </p>
              <p className="text-xl">
                <strong>Aceleração (0-100 km/h):</strong> {acceleration}s
              </p>
            </div>
            <button
              onClick={goToCustomization}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Personalizar Carro
            </button>
          </div>
        </section>
      )}

      {/* ETAPA 2: PERSONALIZAÇÃO */}
      {step === 2 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
            {/* Imagem do carro (se nenhuma cor estiver selecionada, exibe /carro1.jpg por padrão) */}
            <div className="w-full lg:w-2/3 flex justify-center">
              <img
                src={selectedColor ? carImages[selectedColor] : "/carro1.jpg"}
                alt="Carro Personalizado"
                className="w-full max-w-lg object-cover transition-all duration-300"
              />
            </div>

            {/* Área de customização */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:pl-8">
              <h2 className="text-2xl font-bold mb-4">Personalize o Carro</h2>

              {/* Cor */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Cor:</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedColor("red")}
                    className={`w-10 h-10 rounded-full bg-red-500 border-4 transition-colors duration-300 ${
                      selectedColor === "red"
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  ></button>
                  <button
                    onClick={() => setSelectedColor("blue")}
                    className={`w-10 h-10 rounded-full bg-blue-500 border-4 transition-colors duration-300 ${
                      selectedColor === "blue"
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  ></button>
                  <button
                    onClick={() => setSelectedColor("black")}
                    className={`w-10 h-10 rounded-full bg-black border-4 transition-colors duration-300 ${
                      selectedColor === "black"
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  ></button>
                </div>
              </div>

              {/* Jantes */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Jantes:</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedWheels("Jante 1")}
                    className={`px-4 py-2 border rounded ${
                      selectedWheels === "Jante 1"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Jante 1
                  </button>
                  <button
                    onClick={() => setSelectedWheels("Jante 2")}
                    className={`px-4 py-2 border rounded ${
                      selectedWheels === "Jante 2"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Jante 2
                  </button>
                  <button
                    onClick={() => setSelectedWheels("Jante 3")}
                    className={`px-4 py-2 border rounded ${
                      selectedWheels === "Jante 3"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Jante 3
                  </button>
                </div>
              </div>

              {/* Spoiler */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Spoiler:</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedSpoiler("Spoiler 1")}
                    className={`px-4 py-2 border rounded ${
                      selectedSpoiler === "Spoiler 1"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Spoiler 1
                  </button>
                  <button
                    onClick={() => setSelectedSpoiler("Spoiler 2")}
                    className={`px-4 py-2 border rounded ${
                      selectedSpoiler === "Spoiler 2"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Spoiler 2
                  </button>
                </div>
              </div>

              {/* Pneus */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Pneus:</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedTires("Pneu 1")}
                    className={`px-4 py-2 border rounded ${
                      selectedTires === "Pneu 1"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Pneu 1
                  </button>
                  <button
                    onClick={() => setSelectedTires("Pneu 2")}
                    className={`px-4 py-2 border rounded ${
                      selectedTires === "Pneu 2"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Pneu 2
                  </button>
                  <button
                    onClick={() => setSelectedTires("Pneu 3")}
                    className={`px-4 py-2 border rounded ${
                      selectedTires === "Pneu 3"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Pneu 3
                  </button>
                </div>
              </div>

              <button
                onClick={goToSummary}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submeter Compra
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ETAPA 3: RESUMO/COMPRA */}
      {step === 3 && (
        <section className="py-16 px-4 flex justify-center">
          <div className="bg-white p-8 rounded shadow-md max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold mb-4">Resumo da Compra</h1>
            <p className="mb-2">
              <strong>Carro:</strong> Carro 3
            </p>
            <p className="mb-2">
              <strong>Cor:</strong> {selectedColor}
            </p>
            <p className="mb-2">
              <strong>Jantes:</strong> {selectedWheels}
            </p>
            <p className="mb-2">
              <strong>Spoiler:</strong> {selectedSpoiler}
            </p>
            <p className="mb-2">
              <strong>Pneus:</strong> {selectedTires}
            </p>
            <p className="mb-2">
              <strong>Preço:</strong> R$ {price.toLocaleString()}
            </p>
            <button
              onClick={finishPurchase}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirmar Compra
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
