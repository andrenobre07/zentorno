import * as admin from 'firebase-admin';

// Adicionámos uns console.log aqui para depuração
console.log("--- A carregar a API /api/deleteUser ---");
console.log("ID do Projeto lido do .env:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("Email do Cliente lido do .env:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("Chave Privada existe no .env?", !!process.env.FIREBASE_PRIVATE_KEY); // Mostra true/false

// Helper para inicializar a app do Admin apenas uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log(">>> SUCESSO: Firebase Admin inicializado com sucesso!");
  } catch (e) {
    console.error(">>> ERRO: Falha ao inicializar o Firebase Admin:", e.message);
  }
}

export default async function handler(req, res) {
  console.log("--- Pedido recebido em /api/deleteUser ---");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { idToken, uidToDelete } = req.body;

    if (!idToken || !uidToDelete) {
      return res.status(400).json({ error: 'Faltam parâmetros obrigatórios: idToken, uidToDelete.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.admin) {
      return res.status(403).json({ error: 'Ação negada. Apenas administradores podem eliminar utilizadores.' });
    }

    await admin.auth().deleteUser(uidToDelete);
    await admin.firestore().collection('users').doc(uidToDelete).delete();

    return res.status(200).json({ success: true, message: 'Utilizador eliminado com sucesso.' });

  } catch (error) {
    console.error('Erro no handler da API /api/deleteUser:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.', details: error.message });
  }
}