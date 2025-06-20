const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Esta função é acionada sempre que um novo utilizador é criado na Autenticação
exports.createUserDocument = functions.auth.user().onCreate((user) => {
  // O 'user' que recebemos aqui tem 'uid', 'email', 'displayName', etc.
  const db = admin.firestore();

  // Criamos um novo documento na coleção 'users' com o UID do novo utilizador
  return db.collection("users").doc(user.uid).set({
    uid: user.uid,
    name: user.displayName, // O nome que definimos no updateProfile
    email: user.email,
    createdAt: new Date().toISOString(),
  })
  .then(() => {
    console.log(`Documento para o utilizador ${user.uid} criado com sucesso.`);
    return null;
  })
  .catch((error) => {
    console.error(`Erro ao criar documento para o utilizador ${user.uid}:`, error);
    return null;
  });
});