import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg'
import Button from '@mui/material/Button'; // Importando o Button do MUI
import login from '../../src/pages/login/index'


import styles from '../../styles/Home.module.scss';

import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";

// import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {

  const [clickedButton, setClickedButton] = useState<number | null>(null);


  const handleClick = (index: number) => {
    setClickedButton(index); // Atualiza o índice do botão clicado
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src={logoImg} alt="Logo Pizzaria" width={200} height={500} />
        </div>
        <div className={styles.navLogo}>
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
        <Button className={clickedButton === 0 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(0)}>
          💰Promoções
        </Button>
        <Button
          className={clickedButton === 1 ? styles.clickedButton : styles.customButton} // Classe condicional com base no estado
          variant="contained"
          onClick={() => handleClick(1)} // Define o botão 1 como clicado
        >
          🍕Pizzas Salgadas
        </Button>
        <Button
          className={clickedButton === 2 ? styles.clickedButton : styles.customButton} // Classe condicional com base no estado
          variant="contained"
          onClick={() => handleClick(2)} // Define o botão 1 como clicado
        >
          🍩Pizzas Doces
        </Button>

        <Button
          className={clickedButton === 3 ? styles.clickedButton : styles.customButton} // Classe condicional com base no estado
          variant="contained"
          onClick={() => handleClick(3)} // Define o botão 1 como clicado
        >
          🍸Bebidas
        </Button>

        <Button
          className={clickedButton === 4 ? styles.clickedButton : styles.customButton} // Classe condicional com base no estado
          variant="contained"
          onClick={() => handleClick(4)} // Define o botão 1 como clicado
        >
          🔔Novidades
        </Button>

      </div>


    </>
  );
}

// export const getServerSideProps = canSSRGuest(async (ctx) => {
//   return {
//     props: {}
//   };
// });
