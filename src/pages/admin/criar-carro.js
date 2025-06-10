// src/pages/admin/criar-carro.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc } from "firebase/firestore"; // Import addDoc to add documents
import { db } from "../../lib/firebaseConfig"; // Import db from your firebaseConfig
import { Car, Loader } from "lucide-react"; // Import icons

export default function CreateCar() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("sedan"); // Default category
  const [imageUrl, setImageUrl] = useState(""); // For the car image URL
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.push("/");
      alert("Acesso negado. Apenas administradores podem aceder a esta página.");
    }
  }, [currentUser, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    // Basic validation
    if (!carName || !description || !basePrice || !category || !imageUrl) {
      setFormError("Por favor, preencha todos os campos.");
      setFormLoading(false);
      return;
    }

    if (isNaN(basePrice) || parseFloat(basePrice) <= 0) {
      setFormError("O preço base deve ser um número positivo.");
      setFormLoading(false);
      return;
    }

    try {
      // Add a new document with a generated ID to the "cars" collection
      await addDoc(collection(db, "cars"), {
        nome: carName,
        descricao: description,
        preco: parseFloat(basePrice),
        categoria: category,
        imagem: imageUrl,
        createdAt: new Date().toISOString(),
      });

      setFormSuccess(true);
      setCarName("");
      setDescription("");
      setBasePrice("");
      setCategory("sedan");
      setImageUrl("");
      alert("Carro adicionado com sucesso ao catálogo!");
    } catch (err) {
      console.error("Erro ao adicionar carro:", err);
      setFormError("Erro ao adicionar o carro. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Verificando permissões...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-8">
      <Navbar />

      <section className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Adicionar Novo Carro</h1>

          {formError && (
            <p className="text-red-600 text-center mb-4">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-green-600 text-center mb-4">Carro adicionado com sucesso!</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="carName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Carro
              </label>
              <input
                type="text"
                id="carName"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ex: Tesla Model S"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Uma breve descrição do carro..."
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Base (€)
              </label>
              <input
                type="number"
                id="basePrice"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ex: 85000"
                min="0"
                step="any"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                required
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="eletrico">Elétrico</option>
                <option value="hatchback">Hatchback</option>
                <option value="picape">Picape</option>
                <option value="esportivo">Esportivo</option>
              </select>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem do Carro
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ex: https://example.com/carro.jpg"
                required
              />
              {imageUrl && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <p className="text-sm text-gray-600 p-2 border-b">Preview da Imagem:</p>
                  <img src={imageUrl} alt="Preview do Carro" className="w-full h-auto object-contain max-h-64" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all flex items-center justify-center ${
                formLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200"
              }`}
            >
              {formLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Car size={20} className="mr-2" />
                  Adicionar Carro
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}