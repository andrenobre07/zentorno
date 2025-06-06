// pages/_app.js
import "../styles/globals.css";
import { AuthContextProvider } from "../context/AuthContext"; // Importa o AuthContextProvider

function MyApp({ Component, pageProps }) {
  return (
    // Envolve a sua aplicação com o AuthContextProvider
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
