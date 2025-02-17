// pages/index.js
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Seção com vídeo de fundo */}
      <section className="relative h-screen">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/video.mp4" 
          autoPlay 
          loop 
          muted 
        />
        {/* Conteúdo sobre o vídeo */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8">
          <h1 className="text-white text-5xl font-bold">Bem-vindo à Zentorno</h1>
          <p className="text-white mt-4">Encontre o carro dos seus sonhos</p>
          <a 
            href="/comprar" 
            className="mt-8 px-6 py-3 bg-transparent border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white"
          >
            Comprar Carros
          </a>
        </div>
        {/* Overlay para escurecer o vídeo */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </section>

      {/* Seção Sobre Nós */}
      <section id="sobre-nos" className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Sobre Nós</h2>
          <p className="text-gray-700 text-center">
            A Zentorno é a sua melhor escolha para encontrar carros de alta qualidade com os melhores preços e atendimento personalizado.
          </p>
        </div>
      </section>
    </main>
  );
}
