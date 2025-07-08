import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Loader, Mail } from "lucide-react";
import { useAuth } from '../context/AuthContext'; // 1. Importar o useAuth

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth(); // 2. Obter o utilizador autenticado

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // 3. Criar estado para o email, pré-preenchendo com o email do utilizador se existir
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        // 4. Enviar o email que o utilizador escreveu para o Stripe
        receipt_email: email, 
      },
    });
    
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("Ocorreu um erro inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      
      {/* 5. Adicionar o campo de Email ao formulário */}
      <div>
        <label htmlFor="email" className="block text-lg font-semibold mb-2">Email para Recibo</label>
        <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="O seu email"
            />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Morada de Entrega</h3>
        <AddressElement id="address-element" options={{mode: 'shipping'}} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Detalhes de Pagamento</h3>
        <PaymentElement id="payment-element" />
      </div>

      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <span id="button-text">
          {isLoading ? <Loader className="animate-spin"/> : "Pagar Agora"}
        </span>
      </button>
      {message && <div id="payment-message" className="mt-4 text-red-600 text-center">{message}</div>}
    </form>
  );
}