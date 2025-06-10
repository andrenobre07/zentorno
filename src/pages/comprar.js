// src/pages/comprar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { Loader } from 'lucide-react';

export default function Comprar() {
  const [filtro, setFiltro] = useState("todos");
  const [precoMaximo, setPrecoMaximo] = useState(200000);
  const [carros, setCarros] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errorLoadingCars, setErrorLoadingCars] = useState(null);
  const [carrosFiltrados, setCarrosFiltrados] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoadingCars(true);
        setErrorLoadingCars(null);
        const carsCollectionRef = collection(db, "cars");
        const q = query(carsCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const carsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCarros(carsList);
        if (carsList.length > 0) {
          const maxPrice = Math.max(...carsList.map(car => car.preco));
          setPrecoMaximo(maxPrice > 200000 ? maxPrice + 10000 : 200000);
        }
      } catch (err) {
        console.error("Erro ao buscar carros do Firestore:", err);
        setErrorLoadingCars("Não foi possível carregar os carros. Tente novamente mais tarde.");
      } finally {
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const resultado = carros.filter(carro => {
      const filtroCategoriaOk = filtro === "todos" || carro.categoria === filtro;
      const filtroPrecoOk = carro.preco <= precoMaximo;
      return filtroCategoriaOk && filtroPrecoOk;
    });
    setCarrosFiltrados(resultado);
  }, [filtro, precoMaximo, carros]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="relative h-80 bg-gradient-to-r from-blue-800 to-blue-600 mb-8">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Encontra o teu próximo carro</h1>
            <p className="text-xl max-w-2xl mx-auto">Explora a nossa coleção exclusiva e encontra o veículo dos teus sonhos com opções personalizáveis</p>
          </div>
        </div>
      </div>
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Filtros */}
          <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Filtrar Veículos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {["todos", "eletrico", "sedan", "suv", "hatchback", "picape", "esportivo"].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setFiltro(tipo)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filtro === tipo
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço máximo: €{precoMaximo.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={precoMaximo}
                  onChange={(e) => setPrecoMaximo(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>€0</span>
                  <span>€500.000+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Resultados */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{carrosFiltrados.length} Veículos Encontrados</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select className="border rounded-lg px-3 py-2 bg-white text-sm">
                <option>Preço: Menor para Maior</option>
                <option>Preço: Maior para Menor</option>
                <option>Mais Recentes</option>
                <option>Mais Populares</option>
              </select>
            </div>
          </div>
          {loadingCars && (
            <div className="text-center py-12 flex flex-col items-center">
              <Loader size={48} className="animate-spin text-blue-600 mb-4" />
              <p className="text-gray-700">A carregar carros...</p>
            </div>
          )}
          {errorLoadingCars && (
            <div className="text-center py-12">
              <p className="text-red-600">{errorLoadingCars}</p>
            </div>
          )}
          {!loadingCars && !errorLoadingCars && carrosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mt-4">Nenhum veículo encontrado</h3>
              <p className="text-gray-600 mt-2">Tente ajustar os filtros para ver mais opções</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {carrosFiltrados.map((carro) => (
                <motion.div
                  key={carro.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56">
                    <img
                      src={carro.imagem}
                      alt={carro.nome}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
                      €{carro.preco.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{carro.nome}</h3>
                    <p className="text-gray-600 mb-4">{carro.descricao}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                        {carro.categoria.charAt(0).toUpperCase() + carro.categoria.slice(1)}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                        Disponível
                      </span>
                    </div>

                    {/* AQUI ESTÁ A ÚNICA ALTERAÇÃO: O BOTÃO DE CORAÇÃO FOI REMOVIDO */}
                    <div className="flex gap-4">
                      <Link href={`/car/${carro.id}`} className="flex-1">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                          Ver Detalhes
                        </button>
                      </Link>
                    </div>
                    
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {/* Paginação */}
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-l-md">
                Anterior
              </a>
              <a href="#" className="py-2 px-4 bg-blue-600 text-white border border-blue-600">
                1
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-r-md">
                Próxima
              </a>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}