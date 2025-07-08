// ficheiro: src/pages/termos-de-uso.js

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
              <p>Ao aceder e utilizar o website da Zentorno, concorda em cumprir e ficar vinculado por estes Termos de Uso. Se não concordar com qualquer parte dos termos, não deverá utilizar o nosso website.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Uso do Website</h2>
              <p>Este website destina-se a fornecer informações sobre os nossos veículos e a facilitar a sua compra. É proibido utilizar este site para qualquer finalidade ilegal ou não autorizada. Concorda em não interferir com o funcionamento normal do site.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Propriedade Intelectual</h2>
              <p>Todo o conteúdo presente neste site, incluindo textos, gráficos, logótipos, imagens e software, é propriedade da Zentorno Automóveis e está protegido por leis de direitos de autor. Não é permitida a reprodução ou distribuição de qualquer conteúdo sem a nossa autorização expressa por escrito.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Limitação de Responsabilidade</h2>
              <p>A Zentorno não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar este website. Embora nos esforcemos para fornecer informações precisas, não garantimos que as descrições dos veículos, preços ou outro conteúdo sejam totalmente isentos de erros.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Alterações aos Termos</h2>
              <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer alterações entrarão em vigor imediatamente após a sua publicação no site. O uso continuado do site após tais alterações constitui a sua aceitação dos novos termos.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}