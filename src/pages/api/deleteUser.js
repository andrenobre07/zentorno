// pages/api/deleteUser.js

import admin from '../../lib/firebaseAdminConfig'; // Importa a nossa configuração de admin já corrigida e robusta

export default async function handler(req, res) {
  // 1. Garantir que o método é POST (ou DELETE, conforme preferires)
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }

  try {
    // 2. Extrair o token de autorização e o UID do utilizador a ser eliminado
    const { authorization } = req.headers;
    const { uidToDelete } = req.body;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorização em falta ou mal formatado.' });
    }

    if (!uidToDelete) {
      return res.status(400).json({ error: 'O UID do utilizador a eliminar não foi fornecido.' });
    }

    const token = authorization.split('Bearer ')[1];

    // 3. Verificar o token do *administrador* que está a fazer o pedido
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 4. (PASSO DE SEGURANÇA CRÍTICO) Verificar se o utilizador é um administrador
    // Esta verificação assume que definiste um "custom claim" 'admin' como 'true'
    // no utilizador que tem permissão para apagar outros.
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem eliminar utilizadores.' });
    }
    
    // Evitar que um admin se apague a si mesmo por esta via
    if (decodedToken.uid === uidToDelete) {
        return res.status(400).json({ error: 'Um administrador não se pode eliminar a si próprio.' });
    }

    // 5. Se todas as verificações passaram, eliminar o utilizador-alvo
    await admin.auth().deleteUser(uidToDelete);

    return res.status(200).json({ message: `Utilizador ${uidToDelete} eliminado com sucesso.` });

  } catch (error) {
    // 6. Capturar e registar o erro real no servidor para debugging
    console.error('Erro na API /api/deleteUser:', error);

    // Devolver uma mensagem de erro mais útil para o frontend
    let errorMessage = 'Ocorreu um erro interno no servidor.';
    if (error.code === 'auth/user-not-found') {
        errorMessage = 'O utilizador que tentou eliminar não foi encontrado.';
    } else if (error.code === 'auth/id-token-expired') {
        errorMessage = 'A sua sessão expirou. Por favor, faça login novamente.';
    }

    return res.status(500).json({ error: errorMessage });
  }
}