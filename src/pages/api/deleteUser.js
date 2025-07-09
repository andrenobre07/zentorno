// pages/api/deleteUser.js

import admin from '../../lib/firebaseAdminConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }

  try {
    // ▼▼▼ AQUI ESTÁ A CORREÇÃO ▼▼▼
    // Procuramos por 'authorization' em minúsculas, que é como a Vercel envia.
    // O '||' garante que funciona tanto localmente (possivelmente com 'A' maiúsculo) como na Vercel.
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorização em falta ou mal formatado.' });
    }
    // ▲▲▲ FIM DA CORREÇÃO ▲▲▲

    const { uidToDelete } = req.body;

    if (!uidToDelete) {
      return res.status(400).json({ error: 'O UID do utilizador a eliminar não foi fornecido.' });
    }

    const token = authorizationHeader.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    // Verificação de segurança: Apenas admins podem apagar utilizadores.
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem eliminar utilizadores.' });
    }
    
    if (decodedToken.uid === uidToDelete) {
        return res.status(400).json({ error: 'Um administrador não se pode eliminar a si próprio.' });
    }

    await admin.auth().deleteUser(uidToDelete);

    return res.status(200).json({ message: `Utilizador ${uidToDelete} eliminado com sucesso.` });

  } catch (error) {
    console.error('Erro na API /api/deleteUser:', error);

    let errorMessage = 'Ocorreu um erro interno no servidor.';
    if (error.code === 'auth/user-not-found') {
        errorMessage = 'O utilizador que tentou eliminar não foi encontrado.';
    } else if (error.code === 'auth/id-token-expired') {
        errorMessage = 'A sua sessão expirou. Por favor, faça login novamente.';
    } else if (error.code === 'auth/argument-error') {
        errorMessage = 'O token de autenticação é inválido. Por favor, atualize a página e tente novamente.';
    }

    return res.status(500).json({ error: errorMessage });
  }
}