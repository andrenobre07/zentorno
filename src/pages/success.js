import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Obrigado pela sua encomenda!</h1>
        <p className="text-lg text-gray-600 mb-8">O seu pagamento foi processado com sucesso. Em breve receberá uma confirmação.</p>
        <Link href="/comprar" legacyBehavior>
            <a className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-blue-700">
                Continuar a Comprar
            </a>
        </Link>
    </div>
  );
}