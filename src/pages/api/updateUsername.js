// src/pages/api/updateUsername.js

import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId, newName } = req.body;

  if (!userId || !newName || newName.trim() === '') {
    return res.status(400).json({ error: 'O ID do utilizador e um novo nome válido são obrigatórios.' });
  }

  try {
    // Passo 1: Atualizar o nome na Autenticação do Firebase (displayName)
    await admin.auth().updateUser(userId, {
      displayName: newName,
    });

    // Passo 2: Atualizar o nome no documento do utilizador no Firestore
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.update({
      name: newName,
    });

    res.status(200).json({ message: 'Nome de utilizador atualizado com sucesso!' });
  } catch (error) {
    console.error("Erro ao atualizar o nome de utilizador:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar atualizar o nome.' });
  }
}