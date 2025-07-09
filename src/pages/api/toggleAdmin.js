// pages/api/toggleAdmin.js

import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }

  try {
    // 1. Verificar o token do admin que está a fazer o pedido
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorização do administrador em falta.' });
    }
    const token = authorizationHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. APENAS admins podem promover/despromover outros
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem alterar permissões.' });
    }

    // 3. Obter os dados do pedido: o UID alvo e a ação a tomar
    const { userId: targetUid, makeAdmin } = req.body;

    if (!targetUid) {
      return res.status(400).json({ error: 'O UID do utilizador-alvo não foi fornecido.' });
    }

    // 4. (SEGURANÇA) Um admin não se pode despromover a si mesmo por esta via
    if (decodedToken.uid === targetUid) {
        return res.status(400).json({ error: 'Ação bloqueada. Não pode alterar o seu próprio estatuto de administrador.' });
    }

    // 5. Atualizar o Custom Claim no Firebase AUTHENTICATION
    // Isto é o que o teu backend usa para segurança
    await admin.auth().setCustomUserClaims(targetUid, { admin: makeAdmin });

    // 6. Atualizar o documento no FIRESTORE
    // Isto é o que o teu frontend usa para a UI
    const adminDocRef = db.collection('admins').doc(targetUid);
    if (makeAdmin) {
      // Se estamos a tornar admin, criamos o documento na coleção 'admins'
      await adminDocRef.set({ promotedBy: decodedToken.uid, date: new Date() });
    } else {
      // Se estamos a remover admin, eliminamos o documento
      await adminDocRef.delete();
    }

    const actionText = makeAdmin ? "promovido a" : "removido de";
    return res.status(200).json({ message: `Utilizador ${actionText} administrador com sucesso.` });

  } catch (error) {
    console.error('Erro na API /api/toggleAdmin:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor ao alterar as permissões.' });
  }
}