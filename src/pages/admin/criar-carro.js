import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { Car, Loader, PlusCircle, Trash2, X, AlertTriangle, Image as ImageIcon } from "lucide-react"; // Adicionei o ImageIcon

export default function CreateCar() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [carName, setCarName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("sedan");
  
  // --- ALTERAÇÃO 1: MUDANÇA DE NOME E ADIÇÃO DE ESTADOS PARA A IMAGEM ---
  const [imageBase64, setImageBase64] = useState(""); // Vai guardar a imagem como texto
  const [imagePreview, setImagePreview] = useState(""); // Para mostrar a pré-visualização
  const [imageError, setImageError] = useState("");   // Para erros de upload

  const [engine, setEngine] = useState("");
  const [power, setPower] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [features, setFeatures] = useState("");
  const [colors, setColors] = useState([{ name: "", price: 0, hex: "#000000" }]);
  const [interiors, setInteriors] = useState([{ name: "", price: 0 }]);
  const [packages, setPackages] = useState([{ name: "", price: 0, features: "" }]);
  const [isFeatured, setIsFeatured] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Este useEffect já não é necessário, pois não estamos a validar um URL
  // useEffect(() => { ... });

  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.push("/");
    }
  }, [currentUser, authLoading, router]);

  // --- ALTERAÇÃO 2: NOVA FUNÇÃO PARA PROCESSAR O UPLOAD DA IMAGEM ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação do ficheiro
    if (!file.type.startsWith("image/")) {
        setImageError("Ficheiro inválido. Por favor, selecione uma imagem.");
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
        setImageError("Imagem demasiado grande. O limite é de 5MB.");
        return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setImageBase64(reader.result);   // Guarda a imagem como string Base64
        setImagePreview(reader.result); // Define a pré-visualização
    };
    reader.onerror = () => {
        console.error("Erro ao ler o ficheiro.");
        setImageError("Não foi possível carregar a imagem. Tente novamente.");
    };
  };
  
  const handleAddField = (setter, field) => setter(prev => [...prev, field]);
  const handleRemoveField = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
  const handleFieldChange = (setter, index, event) => {
    const { name, value } = event.target;
    setter(prev => {
      const newFields = [...prev];
      newFields[index] = { ...newFields[index], [name]: value };
      return newFields;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    if (imageError) {
      setFormError("Por favor, corrija o erro da imagem antes de continuar.");
      setFormLoading(false);
      return;
    }

    // --- ALTERAÇÃO 3: VERIFICAÇÃO E USO DA NOVA IMAGEM ---
    if (!imageBase64) {
        setFormError("É obrigatório carregar uma imagem principal para o carro.");
        setFormLoading(false);
        return;
    }

    try {
      const carData = {
        nome: carName,
        tagline: tagline,
        descricao: description,
        preco: parseFloat(basePrice),
        categoria: category,
        imagem: imageBase64, // Usamos a imagem em Base64
        motor: engine,
        potencia: power,
        aceleracao: acceleration,
        velocidadeMaxima: topSpeed,
        consumo: fuelConsumption,
        features: features.split('\n').filter(f => f.trim() !== ''),
        colors: colors.map(c => ({ ...c, price: parseFloat(c.price) || 0 })),
        interiors: interiors.map(i => ({ ...i, price: parseFloat(i.price) || 0 })),
        packages: packages.map(p => ({
          ...p,
          price: parseFloat(p.price) || 0,
          features: p.features.split('\n').filter(f => f.trim() !== '')
        })),
        createdAt: new Date().toISOString(),
        isFeatured: isFeatured,
      };
      
      await addDoc(collection(db, "cars"), carData);

      setFormSuccess(true);
      alert("Carro adicionado com sucesso ao catálogo!");
      router.push('/admin/gerir-carros');

    } catch (err) {
      console.error("Erro ao adicionar carro:", err);
      setFormError(`Erro ao adicionar o carro: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };
 
  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
        <p className="ml-4 text-gray-700 text-lg">A verificar permissões...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-24 pb-12">
      <Navbar />
      <section className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Adicionar Novo Carro</h1>

          {formError && <p className="text-red-600 text-center mb-4">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-center mb-4">Carro adicionado com sucesso!</p>}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="carName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Carro</label>
                  <input type="text" id="carName" value={carName} onChange={(e) => setCarName(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Zentorno GT" required />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                  <input type="text" id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: A velocidade encontra a arte" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Uma breve descrição do carro..." required></textarea>
                </div>
                <div>
                  <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Base (€)</label>
                  <input type="number" id="basePrice" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 85000" min="0" max="999999" required />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="eletrico">Elétrico</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="picape">Picape</option>
                    <option value="desportivo">Desportivo</option>
                  </select>
                </div>

                {/* --- ALTERAÇÃO 4: SUBSTITUIÇÃO DO CAMPO DE URL PELO CAMPO DE UPLOAD --- */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Principal</label>
                    {imagePreview ? (
                        <div className="mt-2 relative">
                            <img src={imagePreview} alt="Pré-visualização do carro" className="w-full h-auto object-contain max-h-64 rounded-lg border p-2" />
                            <button type="button" onClick={() => { setImagePreview(''); setImageBase64(''); }} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label htmlFor="imageUpload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                            <div className="space-y-1 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <p className="pl-1">Carregar um ficheiro</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
                            </div>
                        </label>
                    )}
                    <input id="imageUpload" name="imageUpload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    {imageError && (
                        <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {imageError}
                        </div>
                    )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-gray-700 font-medium">Marcar como Destaque na Página Principal</span>
                </label>
              </div>
            </div>
            
            {/* O resto do teu formulário (Especificações, Equipamento, Cores, etc.) permanece exatamente igual */}
            <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Especificações Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-1">Motor</label>
                        <input type="text" id="engine" value={engine} onChange={(e) => setEngine(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Ex: 4.0L V8 Bi-Turbo" />
                    </div>
                    <div>
                        <label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-1">Potência</label>
                        <input type="text" id="power" value={power} onChange={(e) => setPower(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Ex: 650 cv" />
                    </div>
                    <div>
                        <label htmlFor="acceleration" className="block text-sm font-medium text-gray-700 mb-1">Aceleração (0-100 km/h)</label>
                        <input type="text" id="acceleration" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Ex: 3.1s" />
                    </div>
                    <div>
                        <label htmlFor="topSpeed" className="block text-sm font-medium text-gray-700 mb-1">Velocidade Máxima</label>
                        <input type="text" id="topSpeed" value={topSpeed} onChange={(e) => setTopSpeed(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Ex: 330 km/h" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700 mb-1">Consumo</label>
                        <input type="text" id="fuelConsumption" value={fuelConsumption} onChange={(e) => setFuelConsumption(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Ex: 9.5 L/100km" />
                    </div>
                </div>
            </div>
            <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Equipamento de Série</h2>
                <textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows="5" className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Digite cada item numa nova linha..."></textarea>
            </div>
            <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Cores Disponíveis</h2>
                    {colors.map((color, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4 p-2 border-b">
                            <input type="text" name="name" value={color.name} onChange={e => handleFieldChange(setColors, index, e)} placeholder="Nome da Cor" className="md:col-span-2 px-3 py-2 border rounded-lg" />
                            <input type="number" name="price" value={color.price} onChange={e => handleFieldChange(setColors, index, e)} placeholder="Preço Adicional" className="px-3 py-2 border rounded-lg" min="0" max="999999" />
                            <div className="flex items-center gap-2">
                                <input type="color" name="hex" value={color.hex} onChange={e => handleFieldChange(setColors, index, e)} className="h-10 w-10 p-1 border rounded-lg"/>
                                <button type="button" onClick={() => handleRemoveField(setColors, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddField(setColors, { name: '', price: 0, hex: '#000000' })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Cor</button>
                </div>
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Interiores Disponíveis</h2>
                    {interiors.map((interior, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 p-2 border-b">
                           <input type="text" name="name" value={interior.name} onChange={e => handleFieldChange(setInteriors, index, e)} placeholder="Nome do Interior" className="md:col-span-2 px-3 py-2 border rounded-lg" />
                           <div className="flex items-center gap-2">
                             <input type="number" name="price" value={interior.price} onChange={e => handleFieldChange(setInteriors, index, e)} placeholder="Preço Adicional" className="w-full px-3 py-2 border rounded-lg" min="0" max="999999" />
                             <button type="button" onClick={() => handleRemoveField(setInteriors, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                           </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddField(setInteriors, { name: '', price: 0 })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Interior</button>
                </div>
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Pacotes Opcionais</h2>
                     {packages.map((pkg, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg relative">
                           <button type="button" onClick={() => handleRemoveField(setPackages, index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><X size={16} /></button>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input type="text" name="name" value={pkg.name} onChange={e => handleFieldChange(setPackages, index, e)} placeholder="Nome do Pacote" className="px-3 py-2 border rounded-lg" />
                               <input type="number" name="price" value={pkg.price} onChange={e => handleFieldChange(setPackages, index, e)} placeholder="Preço Adicional" className="px-3 py-2 border rounded-lg" min="0" max="999999" />
                           </div>
                           <textarea name="features" value={pkg.features} onChange={e => handleFieldChange(setPackages, index, e)} rows="3" placeholder="Itens do pacote (um por linha)" className="mt-4 w-full px-3 py-2 border rounded-lg"></textarea>
                        </div>
                     ))}
                     <button type="button" onClick={() => handleAddField(setPackages, { name: '', price: 0, features: '' })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Pacote</button>
                </div>
            </div>
            <button
              type="submit"
              disabled={formLoading || !!imageError}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all flex items-center justify-center ${
                (formLoading || !!imageError) ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
              }`}
            >
              {formLoading ? <Loader size={20} className="animate-spin mr-2" /> : <Car size={20} className="mr-2" />}
              {formLoading ? "A Adicionar..." : "Adicionar Carro ao Catálogo"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}