// src/pages/_app.js
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext"; // Importa AuthProvider (que é um Named Export)

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Usa o AuthProvider para envolver a aplicação */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;