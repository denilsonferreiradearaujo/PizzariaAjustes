import { useContext, FormEvent, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg';
import Button from '@mui/material/Button'; // Importando o Button do MUI
import styles from '../../styles/Home.module.scss';
import Link from "next/link";

// Importações do Card
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// Definindo a interface para os dados de cada pizza
interface Pizza {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface CardsProps {
  image: string;
  description: string;
  price: string;
  altText: string;
}

// Componente de Card individual
function Cards({ image, description, price, altText }: CardsProps) {
  return (
    <Card className={styles.card}>
      <CardMedia
        className={styles.cardImage}
        component="img"
        alt={altText}
        image={image}
      />
      <CardContent>
        <Typography variant="body2" className={styles.cardDescription}>
          {description}
        </Typography>
        <Typography variant="h6" className={styles.cardPrice}>
          A partir de R$ {price}
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Button size="large" className={styles.buttonPersonalize}>Personalizar</Button>
      </CardActions>
    </Card>
  );
}

export default function Home() {
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [pizzas, setPizzas] = useState<Pizza[]>([]); // Estado para os cards de pizzas

  // Carregar os dados das pizzas
  useEffect(() => {
    fetch('/pizzas.json') // Verifique o caminho correto para o arquivo JSON
      .then(response => response.json())
      .then((data: Pizza[]) => setPizzas(data))
      .catch(error => console.error('Erro ao buscar os dados: ', error));
  }, []);

  const handleClick = (index: number) => {
    setClickedButton(index); // Atualiza o índice do botão clicado
  };

  return (
    <>
      <Head>
        <title>Pizzaria</title>
      </Head>

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
        <Image src={baner} alt="Banner Pizzaria" width={1100} height={400} />
      </div>

      {/* Botões de navegação */}
      <div className={styles.paginacao}>
        <Button
          className={clickedButton === 0 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(0)}
        >
          💰Promoções
        </Button>
        <Button
          className={clickedButton === 1 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(1)}
        >
          🍕Pizzas Salgadas
        </Button>
        <Button
          className={clickedButton === 2 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(2)}
        >
          🍩Pizzas Doces
        </Button>
        <Button
          className={clickedButton === 3 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(3)}
        >
          🍸Bebidas
        </Button>
        <Button
          className={clickedButton === 4 ? styles.clickedButton : styles.customButton}
          variant="contained"
          onClick={() => handleClick(4)}
        >
          🔔Novidades
        </Button>
      </div>

      {/* Seção dos Cards */}
      <div className={styles.cardsContainer}>
        {pizzas.length > 0 ? (
          pizzas.map((pizza) => (
            <Cards
              key={pizza.id}
              image={pizza.image}
              altText={pizza.name}
              description={pizza.description}
              price={pizza.price}
            />
          ))
        ) : (
          <p>Carregando pizzas...</p>
        )}
      </div>
    </>
  );
}
