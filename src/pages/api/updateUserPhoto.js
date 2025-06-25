// src/pages/api/updateUserPhoto.js

import admin from '../../lib/firebaseAdminConfig';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId, photoDataURL } = req.body;

  if (!userId || !photoDataURL) {
    return res.status(400).json({ error: 'O ID do utilizador e os dados da foto são obrigatórios.' });
  }

  try {
    // Atualiza o photoURL na Autenticação do Firebase
    await admin.auth().updateUser(userId, {
      photoURL: photoDataURL,
    });

    // Atualiza o photoURL no documento do Firestore
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.update({
      photoURL: photoDataURL,
    });

    res.status(200).json({ message: 'Foto de perfil atualizada com sucesso!' });
  } catch (error) {
    console.error("Erro ao atualizar a foto de perfil:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
}