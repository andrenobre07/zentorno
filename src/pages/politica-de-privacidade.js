// ficheiro: src/pages/politica-de-privacidade.js

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PoliticaDePrivacidade() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Recolha de Informação</h2>
              <p>Recolhemos informações pessoais que nos fornece voluntariamente ao registar-se no nosso site, efetuar uma compra. As informações recolhidas podem incluir o seu nome, endereço de e-mail, morada e informações de pagamento.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Uso da Informação</h2>
              <p>As informações que recolhemos são utilizadas para processar as suas encomendas, personalizar a sua experiência no site, melhorar o nosso serviço ao cliente e enviar e-mails periódicos com novidades ou informações sobre a sua encomenda.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Proteção da Informação</h2>
              <p>Implementamos uma variedade de medidas de segurança para manter a segurança das suas informações pessoais. As transações de pagamento são processadas através de um provedor de gateway seguro (Stripe) e não são armazenadas ou processadas nos nossos servidores.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Partilha com Terceiros</h2>
              <p>Não vendemos, trocamos ou transferimos as suas informações pessoais para terceiros. Isto não inclui parceiros de confiança que nos auxiliam na operação do nosso site ou na condução dos nossos negócios, desde que essas partes concordem em manter esta informação confidencial.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Os Seus Direitos</h2>
              <p>Tem o direito de aceder, corrigir ou eliminar as suas informações pessoais a qualquer momento. Pode fazê-lo acedendo à sua página de perfil ou contactando-nos diretamente através do e-mail fornecido no nosso site.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}