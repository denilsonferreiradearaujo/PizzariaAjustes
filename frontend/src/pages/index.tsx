import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg';
import Button from '@mui/material/Button';
import { setupAPICliente } from '../../../frontend/src/services/api';

import styles from '../../styles/Home.module.scss';
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";

// Componente principal
export default function Home() {
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);  // Estado para armazenar os produtos
  const [loading, setLoading] = useState<boolean>(false);

  // Função para capturar o clique e buscar produtos da categoria
  const handleClick = async (categoriaId: number) => {
    setClickedButton(categoriaId);
    setLoading(true);

    try {
      // Faz a requisição para a API passando a categoria
      const apiCliente = setupAPICliente();

      const response = await apiCliente.get(`/produtos?categoriaId=${categoriaId}`)
      // const response = await api.get();
      setProdutos(response.data);  // Atualiza o estado com os produtos retornados
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src={logoImg} alt="Logo Pizzaria" width={200} height={500} />
        </div>
        <div className={styles.nav}>
          <Link href="/index" legacyBehavior>
            <a className={styles.button}>Colaborador</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className={styles.button}>Acessar</a>
          </Link>
          <Link href="/signup" legacyBehavior>
            <a className={styles.button}>Cadastrar</a>
          </Link>
        </div>
      </header>

      <div className={styles.subHeader}>
        <Link href="/" legacyBehavior>
          <a className={styles.localizacao}>Loja Sumaré 📍</a>
        </Link>
        <div className={styles.carrinho}>
          🛒
        </div>
      </div>

      <div className={styles.baner}>
        <Image src={baner} alt="Logo Pizzaria" width={1100} height={400} />
      </div>

      <div className={styles.paginacao}>
        <Button
          className={clickedButton === 1 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(1)}>
          🍕Pizzas Salgadas
        </Button>

        <Button
          className={clickedButton === 2 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(2)}>
          🍩Pizzas Doces
        </Button>

        <Button
          className={clickedButton === 3 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(3)}>
          🍸Bebidas
        </Button>
      </div>

      {/* Renderiza os produtos */}
      <div className={styles.produtoContainer}>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{produto.nome}</h3>
              <p className={styles.cardText}>Categoria: {produto.Categoria.nome}</p>
              <p className={styles.cardText}>Preço: R$ {produto.valores[0].preco}</p>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado</p>
        )}
      </div>
    </>
  );
}