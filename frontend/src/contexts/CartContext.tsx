// src/contexts/CartContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  produtoId: number;
  nome: string;
  tamanho: string;
  quantidade: number;
  preco: number;
  idValor: number;
}

interface CartContextData {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Carregar o carrinho do localStorage ao inicializar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      console.log("Carregando carrinho do localStorage:", storedCart);
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Atualizar o localStorage sempre que o carrinho for atualizado, após a inicialização
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log("Carrinho salvo no localStorage:", cart);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(i => i.produtoId === item.produtoId && i.tamanho === item.tamanho);
      if (existingItem) {
        return prevCart.map(i =>
          i === existingItem ? { ...i, quantidade: i.quantidade + item.quantidade } : i
        );
      }
      return [...prevCart, item];
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // Limpa o carrinho do localStorage ao chamar `clearCart`
  };

  const totalAmount = () => cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
