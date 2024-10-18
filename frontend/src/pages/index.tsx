import { useContext, useState, useEffect } from "react";
import { Footer } from '../components/Footer';
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg';
import calabresaImg from '../../public/calabresa.png' // Pizzas Salgadas
import alohoPoroImg from '../../public/alhoPorocomSalada.png'
import portuguesaImg from '../../public/Portuguesa.png'
import baconImg from '../../public/bacon.png'
import brasileiraImg from '../../public/brasileira.png'
import brocolisImg from '../../public/brocolis.png'
import camaraoImg from '../../public/camarao.png'
import espanholaImg from '../../public/espanhola.png'
import lomboImg from '../../public/lombocomCatupiry.png'
import margueridtaImg from '../../public/marguerita.png'
import morangChoc from '../../public/chocolateMorango.png' // Pizzas Doces
import confete from '../../public/pizzaConfete.png'
import pacoca from '../../public/PizzaPacoca.jpeg'
import brigadeirao from '../../public/brigadeiro.png'
import amendoin from '../../public/pizzaAmendoin.png'
import cocaCola2L from '../../public/coca2L.jpeg' // Bebidas
import cocaColaLata from '../../public/cocaLata.png'
import fantaGuarana from '../../public/fantaGuarana2L.png'
import FantaLaranja from '../../public/fantaLaranja2L.png'
import fantaUvaLata from '../../public/fantaUva.png'
import guaranaJesus from '../../public/guaranaJesusLata.png'
import laranja1L from '../../public/laranja1L.png'
import maguary2L from '../../public/maguary.png'
import pepsiNaLata from '../../public/pepsiLata.png'
import sodaLata from '../../public/soda.png'
import sprite from '../../public/spriteLata.png'
import tampico2L from '../../public/tampico.png'
import twistNaLata from '../../public/twistLata.png'
import erroImg from '../../public/naoFoi.png'
import Button from '@mui/material/Button';
import { setupAPICliente } from '../../../frontend/src/services/api';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from '../../styles/Home.module.scss';
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";

// Função para retornar a imagem correta
function getImageForProduct(nome: string) {
  switch (nome) {
    case 'Pizza de Marguerita': // Pizzas Salgadas
      return margueridtaImg;
    case 'Pizza de Calabresa':
      return calabresaImg;
    case 'Pizza de Alho Poró':
      return alohoPoroImg;
    case 'Pizza de Bacon':
      return baconImg;
    case 'Pizza Brasileira':
      return brasileiraImg;
    case 'Pizza de Brócolis':
      return brocolisImg;
    case 'Pizza de Camarão':
      return camaraoImg;
    case 'Pizza Espanhola':
      return espanholaImg;
      case 'Pizza de Confete':
      return confete;
      case 'Pizza de Morango com Chocolate': // Pizzas Doces
      return morangChoc;
      case 'Pizza de Paçoca':
      return pacoca;
      case 'Pizza de Brigadeiro':
      return brigadeirao;
      case 'Pizza de Brigadeiro':
      return brigadeirao;
      case 'Pizza de Amendoin':
      return amendoin;
      case 'Coca Cola 2L': // Bebidas
      return cocaCola2L;
      case 'Coca Cola Lata':
      return cocaColaLata;
      case 'Fanta Guarana 2L':
      return fantaGuarana;
      case 'Fanta Laranja 2L':
      return FantaLaranja;
      case 'Fanta Uva Lata':
      return fantaUvaLata;
      case 'Guarana Jesus Lata':
      return guaranaJesus;
      case 'Suco de Laranja Natural 1L':
      return laranja1L;
      case 'Suco Maguary de Laranja 2L':
      return maguary2L;
      case 'Pepsi Lata':
      return pepsiNaLata;
      case 'Soda Lata':
      return sodaLata;
      case 'Sprite Lata':
      return sprite;
      case 'Tampico 2L':
      return tampico2L;
      case 'Pepsi Twist Lata':
      return twistNaLata;
    default:
      return erroImg; // Imagem padrão para pizzas doces ou outros itens
  }
}

// Componente principal
export default function Home() {
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);  // Estado para armazenar os produtos
  const [loading, setLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

          <Link href="/login" legacyBehavior>
            <a className={styles.button}>Acessar</a>
          </Link>

          <Link href="/signup" legacyBehavior>
            <a className={styles.button}>Cadastrar</a>
          </Link>
        </div>
      </header>

      <div className={styles.subHeader}>
        <Link href="#" legacyBehavior>
          <a className={styles.localizacao} onClick={handleOpen}>
            Loja Sumaré 📍
          </a>
        </Link>
        <div className={styles.carrinho}>
          🛒
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="map-modal"
        aria-describedby="map-modal-description"
      >
        <Box className={styles.modalBox}>
          <iframe
            width="100%"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.322653421742!2d-47.26300282545686!3d-22.834092479134377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8bd1ab1fc77f3%3A0xf2ff0cd47cdcb7d8!2sEscola%20SENAI%20%22Dr.%20Celso%20Charuri%22!5e0!3m2!1sen!2sbr!4v1697399239926!5m2!1sen!2sbr"
          />
        </Box>
      </Modal>

      <div className={styles.baner}>
        <Image src={baner} alt="Logo Pizzaria" width={1100} height={400} />
      </div>

      {showMap && (
        <div className={styles.mapContainer}>
          <iframe
            width="400"
            height="300"
            src="https://maps.google.com/maps?q=sumaré&t=&z=13&ie=UTF8&iwloc=&output=embed"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
          />
        </div>
      )}

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
              {/* Aqui a função decide qual imagem mostrar */}
              <Image
                src={getImageForProduct(produto.nome)}
                alt={`Imagem de ${produto.nome}`}
                width={150}
                height={150}
              />
              <h3 className={styles.cardTitle}>{produto.nome}</h3>
              <p className={styles.cardText}>Preço: R$ {produto.valores[0].preco}</p>
              <Button className={styles.clickedButton2}>
                Adcionar
              </Button>
            </div>
          ))
        ) : (
          <p className={styles.espacoFooter}>Nenhum produto encontrado</p>
        )}
      </div>
      <Footer />
    </>
  );
}