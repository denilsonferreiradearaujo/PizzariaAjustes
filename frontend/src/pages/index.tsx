import { useContext, useState, useEffect } from "react";
import { Footer } from '../components/Footer';
import Head from "next/head";
import Image from "next/image";

import logoImg from '../../public/logo.png';
import baner from '../../public/baner.jpg';
import calabresaImg from '../../public/calabresa.png'; // Pizzas Salgadas
import alohoPoroImg from '../../public/alhoPorocomSalada.png';
import portuguesaImg from '../../public/Portuguesa.png';
import baconImg from '../../public/bacon.png';
import brasileiraImg from '../../public/brasileira.png';
import brocolisImg from '../../public/brocolis.png';
import camaraoImg from '../../public/camarao.png';
import espanholaImg from '../../public/espanhola.png';
import lomboImg from '../../public/lombocomCatupiry.png';
import margueridtaImg from '../../public/marguerita.png';
import morangChoc from '../../public/chocolateMorango.png'; // Pizzas Doces
import confete from '../../public/pizzaConfete.png';
import pacoca from '../../public/PizzaPacoca.jpeg';
import brigadeirao from '../../public/brigadeiro.png';
import amendoin from '../../public/pizzaAmendoin.png';
import cocaCola2L from '../../public/coca2L.jpeg'; // Bebidas
import cocaColaLata from '../../public/cocaLata.png';
import fantaGuarana from '../../public/fantaGuarana2L.png';
import FantaLaranja from '../../public/fantaLaranja2L.png';
import fantaUvaLata from '../../public/fantaUva.png';
import guaranaJesus from '../../public/guaranaJesusLata.png';
import laranja1L from '../../public/laranja1L.png';
import maguary2L from '../../public/maguary.png';
import pepsiNaLata from '../../public/pepsiLata.png';
import sodaLata from '../../public/soda.png';
import sprite from '../../public/spriteLata.png';
import tampico2L from '../../public/tampico.png';
import twistNaLata from '../../public/twistLata.png';
import erroImg from '../../public/naoFoi.png';
import CheckoutModal from '../components/checkoutModal';

import { setupAPICliente } from '../../../frontend/src/services/api';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from '../../styles/home.module.scss';
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";

interface Categoria {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  valores: { preco: number; tamanho: string }[];
}

function getImageForProduct(nome: string) {
  switch (nome) {
    case 'Pizza de Marguerita':
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
    case 'Pizza de Morango com Chocolate':
      return morangChoc;
    case 'Pizza de Paçoca':
      return pacoca;
    case 'Pizza de Brigadeiro':
      return brigadeirao;
    case 'Pizza de Amendoin':
      return amendoin;
    case 'Coca Cola 2L':
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
      return erroImg;
  }
}

export default function Home() {
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Produto[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({}); // Estado para tamanho selecionado
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenCheckout = () => setOpenCheckoutModal(true);
  const handleCloseCheckout = () => setOpenCheckoutModal(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get("/listCategory");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleClick = async (categoriaId: number) => {
    setClickedButton(categoriaId);
    setLoading(true);

    try {
      const apiCliente = setupAPICliente();
      const response = await apiCliente.get(`/produtos?categoriaId=${categoriaId}`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (produtoId: number, tamanho: string) => {
    setSelectedSizes((prev) => ({ ...prev, [produtoId]: tamanho }));
  };

  const addToCart = (produto: Produto) => {
    const selectedSize = selectedSizes[produto.id];
    const selectedValor = produto.valores.find((valor) => valor.tamanho === selectedSize);

    if (selectedValor) {
      setCart((prevCart) => [
        ...prevCart,
        {
          id: produto.id,
          nome: produto.nome,
          tamanho: selectedSize,
          preco: selectedValor.preco,
        },
      ]);
      console.log("Produto adicionado ao carrinho:", {
        id: produto.id,
        nome: produto.nome,
        tamanho: selectedSize,
        preco: selectedValor.preco,
      });
    } else {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.");
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
            Loja: Sumaré 📍
          </a>
        </Link>
        <div className={styles.carrinho}>
          <Link href="/checkout">
            🛒
          </Link>
        </div>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="map-modal" aria-describedby="map-modal-description">
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

      <div className={styles.paginacao}>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            className={clickedButton === categoria.id ? styles.clickedButton : styles.customButton}
            onClick={() => handleClick(categoria.id)}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      <div className={styles.produtoContainer}>
        {loading ? (
          <p>Carregando produtos, por favor aguarde...</p>
        ) : produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <Image src={getImageForProduct(produto.nome)} alt={`Imagem de ${produto.nome}`} width={210} height={160} />
              <h2 className={styles.cardTitle}>{produto.nome}</h2>
              <p className={styles.cardText}>
                <button>P-{produto.valores?.[0]?.preco ?? "Não disponível"}</button>
                <button>M-{produto.valores?.[1]?.preco ?? "Não disponível"}</button>
                <button>G-{produto.valores?.[2]?.preco ?? "Não disponível"}</button>
              </p>
              <button className={styles.addButton} onClick={() => addToCart(produto)}>
                Adicionar ao Carrinho
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado para esta categoria.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
