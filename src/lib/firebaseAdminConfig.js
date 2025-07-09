import admin from 'firebase-admin';

// Verifica se a aplicação já foi inicializada para evitar erros
if (!admin.apps.length) {
  try {
    // --- A CORREÇÃO ESTÁ AQUI ---
    // 1. Lemos a chave privada codificada em Base64 da variável de ambiente
    const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY;
    
    // 2. Descodificamos a chave de Base64 de volta para o seu formato original com quebras de linha
    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf8');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // 3. Usamos a chave descodificada
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin SDK inicializado com sucesso.");
  } catch (error) {
    console.error("ERRO CRÍTICO ao inicializar o Firebase Admin SDK:", error);
    // Este log é crucial para o debug na Vercel
    if (error.code === 'app/duplicate-app') {
      console.warn("Aviso: Tentativa de inicializar uma app Firebase duplicada.");
    }
  }
}

export default admin;