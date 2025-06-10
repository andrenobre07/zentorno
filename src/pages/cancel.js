import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function Cancel() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <XCircle className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Encomenda Cancelada</h1>
            <p className="text-lg text-gray-600 mb-8">A sua encomenda foi cancelada e não foi efetuada qualquer cobrança.</p>
            <Link href="/comprar" legacyBehavior>
                <a className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-blue-700">
                    Voltar ao Catálogo
                </a>
            </Link>
        </div>
    );
}