// pages/car/carro1.js
import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function Carro1() {
  // Estado para a cor selecionada
  const [selectedColor, setSelectedColor] = useState("red");
  // Exemplo de mapeamento de imagens para cada cor
  const carImages = {
    red: "/carro1-red.png",
    blue: "/carro1-blue.png",
    black: "/carro1-black.png",
  };

  return (
    <main>
      <Navbar />
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          {/* Imagem principal do carro */}
          <div className="w-full lg:w-2/3 flex justify-center">
            <img
              src={carImages[selectedColor]}
              alt="Carro Personalizado"
              className="w-full max-w-lg object-cover transition-all duration-300"
            />
          </div>
          {/* Área de customização */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:pl-8">
            <h2 className="text-2xl font-bold mb-4">Personalize o Carro</h2>
            {/* Opções de cor */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Cor:</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedColor("red")}
                  className={`w-10 h-10 rounded-full bg-red-500 border-4 transition-colors duration-300 ${
                    selectedColor === "red" ? "border-blue-600" : "border-transparent"
                  }`}
                ></button>
                <button
                  onClick={() => setSelectedColor("blue")}
                  className={`w-10 h-10 rounded-full bg-blue-500 border-4 transition-colors duration-300 ${
                    selectedColor === "blue" ? "border-blue-600" : "border-transparent"
                  }`}
                ></button>
                <button
                  onClick={() => setSelectedColor("black")}
                  className={`w-10 h-10 rounded-full bg-black border-4 transition-colors duration-300 ${
                    selectedColor === "black" ? "border-blue-600" : "border-transparent"
                  }`}
                ></button>
              </div>
            </div>
            {/* Opções de Jantes */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Jantes:</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 1
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 2
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 3
                </button>
              </div>
            </div>
            {/* Opções de Spoiler */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Spoiler:</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 1
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 2
                </button>
              </div>
            </div>
            {/* Opções de Pneus */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Pneus:</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 1
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 2
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-200">
                  Opção 3
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
