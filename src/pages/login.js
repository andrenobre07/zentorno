import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <main>
      <Navbar />
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700">Email:</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full border border-gray-300 rounded p-2" 
                placeholder="Digite seu email" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">Senha:</label>
              <input 
                type="password" 
                id="password" 
                className="mt-1 block w-full border border-gray-300 rounded p-2" 
                placeholder="Digite sua senha" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
