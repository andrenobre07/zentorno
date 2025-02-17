// pages/comprar.js
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Comprar() {
  return (
    <main>
      <Navbar />
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Comprar Carros</h1>
          {/* Exemplo de listagem de carros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card do Carro 1 */}
            <div className="relative group shadow-lg rounded-lg overflow-hidden h-64">
              {/* Imagem que ocupa todo o container */}
              <img 
                src="/carro1.jpg" 
                alt="Carro 1" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              
              {/* Overlay com os detalhes */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-40">
                <h2 className="text-xl font-bold text-white">Carro 1</h2>
                <p className="mt-2 text-white">Descrição do Carro 1</p>
                <Link href="/car/carro1">
                  <button className="mt-4 px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white">
                    Comprar
                  </button>
                </Link>
              </div>
            </div>

                        {/* Card do Carro 2 */}
            <div className="relative group shadow-lg rounded-lg overflow-hidden h-64">
              <img 
                src="/carro2.jpg" 
                alt="Carro 2" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-40">
                <h2 className="text-xl font-bold text-white">Carro 2</h2>
                <p className="mt-2 text-white">Descrição do Carro 2</p>
                <Link href="/car/carro2">
                  <button className="mt-4 px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white">
                    Comprar
                  </button>
                </Link>
              </div>
            </div>

            {/* Card do Carro 3 */}
            <div className="relative group shadow-lg rounded-lg overflow-hidden h-64">
              <img 
                src="/carro3.jpg" 
                alt="Carro 3" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-40">
                <h2 className="text-xl font-bold text-white">Carro 3</h2>
                <p className="mt-2 text-white">Descrição do Carro 3</p>
                <Link href="/car/carro3">
                  <button className="mt-4 px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white">
                    Comprar
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
