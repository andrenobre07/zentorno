import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { idToken, uidToDelete } = req.body;

    if (!idToken || !uidToDelete) {
      return res.status(400).json({ error: 'Faltam parâmetros obrigatórios: idToken ou uidToDelete.' });
    }

    // Verifica o token do administrador para garantir que o pedido é legítimo
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const adminUid = decodedToken.uid;

    const adminDocRef = db.collection('admins').doc(adminUid);
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'Ação negada. Apenas administradores podem executar esta ação.' });
    }

    // --- LÓGICA DE ELIMINAÇÃO ROBUSTA ---

    // 1. Tenta apagar o utilizador da Autenticação do Firebase
    try {
      await admin.auth().deleteUser(uidToDelete);
      console.log(`Utilizador ${uidToDelete} apagado com sucesso da Autenticação.`);
    } catch (error) {
      // Se o erro for 'user-not-found', é porque já não existe.
      // Ignoramos este erro específico e continuamos, para limpar o Firestore.
      if (error.code === 'auth/user-not-found') {
        console.log(`Utilizador ${uidToDelete} não foi encontrado na Autenticação, provavelmente já foi apagado. A continuar para limpar o Firestore.`);
      } else {
        // Se for qualquer outro erro, aí sim é um problema. Lançamos o erro para parar a execução.
        throw error;
      }
    }

    // 2. Apaga o documento do utilizador do Firestore (isto irá correr sempre, mesmo que o utilizador já não exista na autenticação)
    await db.collection('users').doc(uidToDelete).delete();
    console.log(`Documento do utilizador ${uidToDelete} apagado com sucesso do Firestore.`);
    
    // 3. Bónus: Garante que também é removido da coleção de admins, se existir.
    await db.collection('admins').doc(uidToDelete).delete().catch(() => { /* ignora erros se não existir */ });


    return res.status(200).json({ message: 'Utilizador e todos os seus dados foram eliminados com sucesso.' });

  } catch (error) {
    console.error('Erro na API /api/deleteUser:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.', details: error.message });
  }
}