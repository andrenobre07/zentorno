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
            <div className="bg-white shadow-lg rounded-lg p-4">
              <img 
                src="/carro1.jpg" 
                alt="Carro 1" 
                className="w-full h-48 object-cover rounded" 
              />
              <h2 className="text-xl font-bold mt-4">Carro 1</h2>
              <p className="mt-2">Descrição do Carro 1</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <img 
                src="/carro2.jpg" 
                alt="Carro 2" 
                className="w-full h-48 object-cover rounded" 
              />
              <h2 className="text-xl font-bold mt-4">Carro 2</h2>
              <p className="mt-2">Descrição do Carro 2</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <img 
                src="/carro3.jpg" 
                alt="Carro 3" 
                className="w-full h-48 object-cover rounded" 
              />
              <h2 className="text-xl font-bold mt-4">Carro 3</h2>
              <p className="mt-2">Descrição do Carro 3</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
