// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredCars = [
    { name: "Zentorno GT", image: "/carro1.jpg", description: "Potência e elegância definidas", link: "/car/carro1" },
    { name: "Astral S", image: "/carro2.jpg", description: "Performance inigualável", link: "/car/carro2" },
    { name: "Phantom X", image: "/carro3.jpg", description: "Luxo em sua forma mais pura", link: "/car/carro3" }
  ];

  // Auto slider para os carros em destaque
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredCars.length]);

  return (
    <main className="bg-black text-white">
      <Navbar />

      {/* Hero section com vídeo de fundo e overlay gradiente */}
      <section className="relative h-screen">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
        
        {/* Conteúdo do Hero */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white drop-shadow-lg">
            ZEN<span className="text-blue-500">TORNO</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-200">
            Carros únicos criados sob medida para ti. Potência, elegância e tecnologia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/comprar">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg flex items-center space-x-2 transform hover:scale-105">
                <span>Ver Catálogo</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
            <a href="#carros-destaque">
              <button className="px-8 py-4 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg transform hover:scale-105">
                Modelos em Destaque
              </button>
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Carros em destaque com slider */}
      <section id="carros-destaque" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">MODELOS EM DESTAQUE</span>
            <div className="absolute w-24 h-1 bg-blue-500 bottom-0 left-1/2 transform -translate-x-1/2 mt-4"></div>
          </h2>
          
          <div className="relative overflow-hidden">
            {/* Slider */}
            <div 
              className="flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredCars.map((car, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-2xl mb-8 md:mb-0">
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className="w-full h-80 object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    </div>
                    <div className="w-full md:w-1/2 md:pl-12 flex flex-col items-center md:items-start">
                      <h3 className="text-3xl font-bold mb-4">{car.name}</h3>
                      <p className="text-gray-300 text-xl mb-6">{car.description}</p>
                      <div className="space-y-4 w-full max-w-sm mb-8">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Aceleração 0-100km/h</span>
                          <span className="font-bold">3.2s</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1 rounded-full">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Velocidade Máxima</span>
                          <span className="font-bold">330 km/h</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1 rounded-full">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <Link href={car.link}>
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                          Personalizar Agora
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Controles do slider */}
            <div className="flex justify-center mt-10 space-x-2">
              {featuredCars.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? 'bg-blue-500 w-6' : 'bg-gray-600'
                  } transition-all duration-300`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de estatísticas */}
      <section className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300">Carros Vendidos</div>
            </div>
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-300">Clientes Satisfeitos</div>
            </div>
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Suporte ao Cliente</div>
            </div>
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2">5+</div>
              <div className="text-gray-300">Opções de Personalização</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <section id="sobre-nos" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <img src="/showroom.jpg" alt="Nossa Garagem" className="rounded-lg shadow-2xl" />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                  <span className="text-3xl font-bold">10</span>
                  <span className="block">Anos de Excelência</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">SOBRE A ZENTORNO</span>
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                A Zentorno nasceu da paixão por carros excepcionais e da visão de oferecer veículos únicos que refletem a personalidade dos teus proprietários.
              </p>
              <p className="text-gray-300 mb-8 text-lg">
                A nossa equipa de engenheiros e designers trabalha incansavelmente para criar máquinas que não apenas impressionam visualmente, mas também entregam performance sem igual e experiências de condução emocionantes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="mr-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <span>Entrega Rápida</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>Garantia Premium</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span>Suporte Dedicado</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <span>Tecnologia Avançada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Pronto para encontrares o carro dos teus sonhos?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Descubra a nossa coleção exclusiva de veículos e cria o teu próprio design personalizado.
          </p>
          <Link href="/comprar">
            <button className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg transform hover:scale-105">
              Explorar Catálogo
            </button>
          </Link>
        </div>
      </section>

     <Footer />
    </main>
  );
}