import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  // 1. Só aceitamos pedidos do tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { token, purchaseId } = req.body;

    // 2. Verificamos se recebemos a informação necessária
    if (!token || !purchaseId) {
      return res.status(400).json({ error: 'Faltam o token de autenticação ou o ID da compra.' });
    }

    // 3. Verificamos se o pedido vem de um administrador autenticado
    const decodedToken = await admin.auth().verifyIdToken(token);
    const adminUid = decodedToken.uid;
    const adminDoc = await db.collection('admins').doc(adminUid).get();

    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem apagar compras.' });
    }

    // 4. Se tudo estiver correto, apagamos o documento da compra do Firestore
    await db.collection('purchases').doc(purchaseId).delete();

    // 5. Devolvemos uma mensagem de sucesso
    return res.status(200).json({ message: 'Compra eliminada com sucesso.' });

  } catch (error) {
    console.error('Erro na API /api/deletePurchase:', error);
    let errorMessage = 'Ocorreu um erro interno no servidor.';
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'A sua sessão expirou. Por favor, faça login novamente.';
    }
    return res.status(500).json({ error: errorMessage });
  }
}