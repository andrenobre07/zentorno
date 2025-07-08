// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializa a App de Admin do Firebase
admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Verifica se o pedido vem de um utilizador autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "O pedido tem de ser feito por um utilizador autenticado."
    );
  }

  const adminUid = context.auth.uid;
  const userToDeleteUid = data.uid;

  // Impede um utilizador de se apagar a si mesmo através desta função
  if (adminUid === userToDeleteUid) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Não pode eliminar a sua própria conta através desta função."
    );
  }

  try {
    // Verifica se o utilizador que fez o pedido é realmente um administrador
    const adminDoc = await admin.firestore().collection("admins").doc(adminUid).get();
    if (!adminDoc.exists) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Apenas administradores podem eliminar utilizadores."
      );
    }
    
    // Se for admin, apaga o utilizador do Firebase Authentication
    await admin.auth().deleteUser(userToDeleteUid);

    // Opcional: Apagar o documento do utilizador na coleção 'users'.
    // O código do frontend já faz isto, mas fazer aqui é mais seguro.
    await admin.firestore().collection("users").doc(userToDeleteUid).delete();

    return { message: `Utilizador ${userToDeleteUid} eliminado com sucesso.` };

  } catch (error) {
    console.error("Erro ao eliminar utilizador:", error);
    // Transforma erros internos em erros que o cliente pode entender
    if (error.code === 'auth/user-not-found') {
        throw new functions.https.HttpsError('not-found', 'O utilizador a eliminar não foi encontrado.');
    }
    throw new functions.https.HttpsError(
      "internal",
      "Ocorreu um erro inesperado ao eliminar o utilizador."
    );
  }
});