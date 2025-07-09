import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  // --- DEBUGGING LOG ---
  console.log("API /api/deletePurchase foi chamada.");

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { token, purchaseId } = req.body;

    if (!token || !purchaseId) {
      console.error("ERRO: Pedido recebido sem token ou purchaseId.");
      return res.status(400).json({ error: 'Faltam o token de autenticação ou o ID da compra.' });
    }

    // --- DEBUGGING LOG ---
    console.log(`A tentar verificar o token para o utilizador e apagar a compra ${purchaseId}...`);

    const decodedToken = await admin.auth().verifyIdToken(token);
    const adminUid = decodedToken.uid;
    
    // --- DEBUGGING LOG ---
    console.log(`Token verificado com sucesso. UID do admin: ${adminUid}`);

    const adminDoc = await db.collection('admins').doc(adminUid).get();

    if (!adminDoc.exists) {
      console.warn(`AVISO: Tentativa de apagar por um não-admin. UID: ${adminUid}`);
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem apagar compras.' });
    }
    
    // --- DEBUGGING LOG ---
    console.log("Utilizador confirmado como admin. A apagar o documento do Firestore...");

    await db.collection('purchases').doc(purchaseId).delete();
    
    // --- DEBUGGING LOG ---
    console.log(`Documento ${purchaseId} apagado com sucesso.`);

    return res.status(200).json({ message: 'Compra eliminada com sucesso.' });

  } catch (error) {
    // --- DEBUGGING LOG ---
    // Este é o log mais importante. Ele vai mostrar-nos o erro exato do Firebase.
    console.error("ERRO CRÍTICO na API /api/deletePurchase:", error);
    
    let errorMessage = 'Ocorreu um erro interno no servidor.';
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'A sua sessão expirou. Por favor, faça login novamente.';
    } else if (error.code && error.code.startsWith('auth/')) {
        errorMessage = 'Erro de autenticação do Firebase.';
    }
    
    // Devolvemos o erro detalhado para a consola do browser também
    return res.status(500).json({ 
        error: errorMessage,
        details: error.message // Inclui a mensagem de erro específica
    });
  }
}