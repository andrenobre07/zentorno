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
        <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 space-y-4">
          <h1 className="text-white text-5xl font-bold drop-shadow-lg">Bem-vindo à Zentorno</h1>
          <p className="text-white text-lg drop-shadow-md">
            Encontre o carro dos seus sonhos
          </p>
          <a
            href="/comprar"
            className="btn-primary"
          >
            Comprar Carros
          </a>
        </div>
        {/* Overlay para escurecer o vídeo */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </section>

      {/* Seção de Destaques/Novos Modelos */}
 {/* Seção de Destaques/Novos Modelos */}
<section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-700">
  <div className="container-custom text-center">
    <h2 className="text-3xl font-bold text-white mb-8">Novos Modelos</h2>
  

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Modelo 1 */}
            <div className="bg-white p-4 rounded shadow-soft hover:shadow-lg transition-default">
              <img
                src="/carro4.jpg"
                alt="Carro 4"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Carro 4</h3>
              <p className="text-gray-600 mt-2">
                Potência incrível, design moderno e muito mais.
              </p>
              <a
                href="/comprar"
                className="inline-block mt-4 btn-primary"
              >
                Comprar
              </a>
            </div>
            {/* Modelo 2 */}
            <div className="bg-white p-4 rounded shadow-soft hover:shadow-lg transition-default">
              <img
                src="/carro5.jpg"
                alt="Carro 5"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Carro 5</h3>
              <p className="text-gray-600 mt-2">
                Um clássico que une conforto e desempenho.
              </p>
              <a
                href="/comprar"
                className="inline-block mt-4 btn-primary"
              >
                Comprar
              </a>
            </div>
            {/* Modelo 3 */}
            <div className="bg-white p-4 rounded shadow-soft hover:shadow-lg transition-default">
              <img
                src="/carro6.jpg"
                alt="Carro 6"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Carro 6</h3>
              <p className="text-gray-600 mt-2">
                Ideal para quem busca luxo e velocidade.
              </p>
              <a
                href="/comprar"
                className="inline-block mt-4 btn-primary"
              >
                Comprar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <section id="sobre-nos" className="py-16 px-4 bg-gray-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sobre Nós</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto">
          A Zentorno é taua melhor escolha para encontrar carros de alta qualidade, com os melhores preços e atendimento personalizado. Com vasta experiência no setor automotivo, oferecemos uma ampla gama           e modelos que unem design de topo, desempenho superior e tecnologia de ponta. O nosso compromisso é to          rnar cada etapa da sua compra uma experiência inesquecível: desde o primeiro contato até o pós-venda, c         ontamos com uma equipe de especialistas pronta para orientar na escolha do veículo perfeito para o seu estilo de vida.

Escolha a Zentorno e descubra um novo padrão de confiança, inovação e excelência na hora de adquirir o carro dos seus sonhos.
          </p>
        </div>
      </section>
    </main>
  );
}
