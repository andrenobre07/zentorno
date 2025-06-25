// src/pages/api/toggleAdmin.js

import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId, makeAdmin } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'O ID do utilizador é obrigatório.' });
  }

  try {
    const adminDocRef = db.collection('admins').doc(userId);

    if (makeAdmin) {
      // Para tornar admin: cria o documento na coleção 'admins'
      // Esta lógica corresponde exatamente ao que o seu AuthContext procura.
      await adminDocRef.set({ isAdmin: true, promotedAt: new Date() });
      res.status(200).json({ message: 'Utilizador promovido a administrador com sucesso.' });
    } else {
      // Para remover admin: apaga o documento da coleção 'admins'
      await adminDocRef.delete();
      res.status(200).json({ message: 'Privilégios de administrador removidos com sucesso.' });
    }

  } catch (error) {
    console.error("Erro ao alterar o estatuto de admin:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
}