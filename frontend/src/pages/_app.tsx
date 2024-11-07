// src/pages/_app.tsx

import '../../styles/globals.scss'
import { AppProps } from "next/app";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext'; // Importando o CartProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider> {/* Envolvendo o componente com CartProvider */}
        <Component {...pageProps} />
        <ToastContainer autoClose={2000} />
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp;


