import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import { Car, Loader, PlusCircle, Trash2, X, Save, AlertTriangle } from "lucide-react";

export default function EditCar() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id: carId } = router.query;

  // Estados do formulário
  const [carName, setCarName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("sedan");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
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
  const [pageLoading, setPageLoading] = useState(true);
  const [formError, setFormError] = useState(null);

  // Carregar os dados do carro quando a página abre
  useEffect(() => {
    if (!carId) return;
    const fetchCarData = async () => {
      setPageLoading(true);
      try {
        const carDocRef = doc(db, "cars", carId);
        const carDocSnap = await getDoc(carDocRef);
        if (carDocSnap.exists()) {
          const carData = carDocSnap.data();
          setCarName(carData.nome || "");
          setTagline(carData.tagline || "");
          setDescription(carData.descricao || "");
          setBasePrice(carData.preco || "");
          setCategory(carData.categoria || "sedan");
          setImageUrl(carData.imagem || "");
          setEngine(carData.motor || "");
          setPower(carData.potencia || "");
          setAcceleration(carData.aceleracao || "");
          setTopSpeed(carData.velocidadeMaxima || "");
          setFuelConsumption(carData.consumo || "");
          setFeatures(carData.features?.join('\n') || "");
          setColors(carData.colors || [{ name: "", price: 0, hex: "#000000" }]);
          setInteriors(carData.interiors || [{ name: "", price: 0 }]);
          setPackages(carData.packages?.map(p => ({ ...p, features: p.features.join('\n') })) || [{ name: "", price: 0, features: "" }]);
          setIsFeatured(carData.isFeatured || false);
        } else {
          setFormError("Carro não encontrado.");
        }
      } catch (err) {
        setFormError("Erro ao carregar dados do carro.");
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchCarData();
  }, [carId]);
  
  // Handlers para campos dinâmicos
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

    if (imageUrlError) {
      setFormError("Por favor, corrija o URL da imagem.");
      setFormLoading(false);
      return;
    }

    try {
      const carDocRef = doc(db, "cars", carId);
      const carData = {
        nome: carName, tagline, descricao: description, preco: parseFloat(basePrice), categoria: category, imagem: imageUrl,
        motor: engine, potencia: power, aceleracao: acceleration, velocidadeMaxima: topSpeed, consumo: fuelConsumption,
        features: features.split('\n').filter(f => f.trim() !== ''),
        colors: colors.map(c => ({ ...c, price: parseFloat(c.price) || 0 })),
        interiors: interiors.map(i => ({ ...i, price: parseFloat(i.price) || 0 })),
        packages: packages.map(p => ({ ...p, price: parseFloat(p.price) || 0, features: p.features.split('\n').filter(f => f.trim() !== '') })),
        isFeatured: isFeatured,
      };
      
      await updateDoc(carDocRef, carData);
      
      alert("Carro atualizado com sucesso!");
      router.push('/admin/gerir-carros');

    } catch (err) {
      console.error("Erro ao atualizar carro:", err);
      setFormError(`Erro ao atualizar o carro: ${err.message}.`);
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || pageLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-24 pb-12">
      <Navbar />
      <section className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Editar Carro: {carName}</h1>
          {formError && <p className="text-red-600 text-center mb-4">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="carName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Carro</label><input type="text" id="carName" value={carName} onChange={(e) => setCarName(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" required /></div>
                <div><label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Slogan</label><input type="text" id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                <div className="md:col-span-2"><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 rounded-lg border-gray-300" required></textarea></div>
                <div><label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Base (€)</label><input type="number" id="basePrice" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" min="0" required /></div>
                <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300 bg-white" required><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="eletrico">Elétrico</option><option value="hatchback">Hatchback</option><option value="picape">Picape</option><option value="desportivo">Desportivo</option></select></div>
                <div className="md:col-span-2"><label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label><input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" required />{imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 w-full h-auto object-contain max-h-64 rounded-lg border p-2" />}</div>
              </div>
              <div className="mt-6 pt-6 border-t"><label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-gray-700 font-medium">Marcar como Destaque na Página Principal</span></label></div>
            </div>
            <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Especificações Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-1">Motor</label><input type="text" id="engine" value={engine} onChange={(e) => setEngine(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                    <div><label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-1">Potência</label><input type="text" id="power" value={power} onChange={(e) => setPower(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                    <div><label htmlFor="acceleration" className="block text-sm font-medium text-gray-700 mb-1">Aceleração (0-100 km/h)</label><input type="text" id="acceleration" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                    <div><label htmlFor="topSpeed" className="block text-sm font-medium text-gray-700 mb-1">Velocidade Máxima</label><input type="text" id="topSpeed" value={topSpeed} onChange={(e) => setTopSpeed(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                    <div className="md:col-span-2"><label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700 mb-1">Consumo</label><input type="text" id="fuelConsumption" value={fuelConsumption} onChange={(e) => setFuelConsumption(e.target.value)} className="w-full px-4 py-2 rounded-lg border-gray-300" /></div>
                </div>
            </div>
            <div className="p-6 border rounded-lg"><h2 className="text-xl font-semibold mb-4 text-gray-800">Equipamento de Série</h2><textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows="5" className="w-full px-4 py-2 rounded-lg border-gray-300" placeholder="Digite cada item numa nova linha..."></textarea></div>
            <div className="space-y-6">
              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Cores Disponíveis</h2>
                {colors.map((color, index) => (<div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4 p-2 border-b"><input type="text" name="name" value={color.name} onChange={e => handleFieldChange(setColors, index, e)} placeholder="Nome da Cor" className="md:col-span-2 px-3 py-2 border rounded-lg" /><input type="number" name="price" value={color.price} onChange={e => handleFieldChange(setColors, index, e)} placeholder="Preço Adicional" className="px-3 py-2 border rounded-lg" /><div className="flex items-center gap-2"><input type="color" name="hex" value={color.hex} onChange={e => handleFieldChange(setColors, index, e)} className="h-10 w-10 p-1 border rounded-lg" /><button type="button" onClick={() => handleRemoveField(setColors, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button></div></div>))}
                <button type="button" onClick={() => handleAddField(setColors, { name: '', price: 0, hex: '#000000' })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Cor</button>
              </div>
              <div className="p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Interiores Disponíveis</h2>
                  {interiors.map((interior, index) => (<div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 p-2 border-b"><input type="text" name="name" value={interior.name} onChange={e => handleFieldChange(setInteriors, index, e)} placeholder="Nome do Interior" className="md:col-span-2 px-3 py-2 border rounded-lg" /><div className="flex items-center gap-2"><input type="number" name="price" value={interior.price} onChange={e => handleFieldChange(setInteriors, index, e)} placeholder="Preço Adicional" className="w-full px-3 py-2 border rounded-lg" /><button type="button" onClick={() => handleRemoveField(setInteriors, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button></div></div>))}
                  <button type="button" onClick={() => handleAddField(setInteriors, { name: '', price: 0 })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Interior</button>
              </div>
              <div className="p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Pacotes Opcionais</h2>
                  {packages.map((pkg, index) => (<div key={index} className="mb-4 p-4 border rounded-lg relative"><button type="button" onClick={() => handleRemoveField(setPackages, index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><X size={16} /></button><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" name="name" value={pkg.name} onChange={e => handleFieldChange(setPackages, index, e)} placeholder="Nome do Pacote" className="px-3 py-2 border rounded-lg" /><input type="number" name="price" value={pkg.price} onChange={e => handleFieldChange(setPackages, index, e)} placeholder="Preço Adicional" className="px-3 py-2 border rounded-lg" /></div><textarea name="features" value={pkg.features} onChange={e => handleFieldChange(setPackages, index, e)} rows="3" placeholder="Itens do pacote (um por linha)" className="mt-4 w-full px-3 py-2 border rounded-lg"></textarea></div>))}
                  <button type="button" onClick={() => handleAddField(setPackages, { name: '', price: 0, features: '' })} className="mt-2 text-blue-600 flex items-center gap-1 hover:text-blue-800"><PlusCircle size={18} /> Adicionar Pacote</button>
              </div>
            </div>
            <button type="submit" disabled={formLoading} className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all flex items-center justify-center bg-green-600 hover:bg-green-700">
              <Save size={20} className="mr-2" />
              {formLoading ? "A Guardar..." : "Guardar Alterações"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}