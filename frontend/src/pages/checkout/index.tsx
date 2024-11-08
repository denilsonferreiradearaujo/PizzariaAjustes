// import React from 'react';
// import { Footer } from '../../components/Footer';
// import Image from 'next/image';
// import Link from 'next/link';
// import logoImg from '../../../public/logo.png';
// import styles from './style.module.scss';
// import Head from "next/head";

// const Checkout: React.FC = () => {
//     return (
//         <>
//             <Head>
//                 <title>Carrinho</title>
//             </Head>
//             {/* Cabeçalho com logo e navegação */}
//             <header className={styles.header}>
//                 <div className={styles.logo}>
//                     <Image src={logoImg} alt="Logo Pizzaria" width={200} height={100} />
//                 </div>
//                 <div className={styles.nav}>
//                     <Link href="/" legacyBehavior>
//                         <a className={styles.button}>Home</a>
//                     </Link>
//                 </div>
//             </header>

//             {/* Conteúdo do Checkout */}
//             <div className={styles.checkoutContainer}>
//                 <h1>Finalizar Pedido</h1>

//                 {/* Resumo do Pedido */}
//                 <section className={styles.orderSummary}>
//                     <h2>Resumo do Pedido</h2>
//                     <div className={styles.orderItem}>
//                         <span>Produto</span>
//                         <span>Tamanho</span>
//                         <span>Quantidade</span>
//                         <span>Preço</span>
//                     </div>
//                     {/* Exemplo de item - esses dados virão de um state ou props */}
//                     <div className={styles.orderItem}>
//                         <span>Pizza Margherita</span>
//                         <span>Pequena</span>
//                         <span>1</span>
//                         <span>R$ 40,00</span>
//                     </div>
//                 </section>

//                 {/* Total do Pedido */}
//                 <section className={styles.orderTotal}>
//                     <p> Total do Pedido R$ 55,00</p>
//                 </section>

//                 {/* Informações do Cliente */}
//                 <section className={styles.customerInfo}>
//                     <h2>Informações do Cliente</h2>
//                     <input type="text" placeholder="Nome" />
//                     <input type="text" placeholder="Celular" />

//                     <div>
//                         <input type="text" placeholder="Cep" />
//                         <input type="text" placeholder="Logradouro" />
//                         <input type="text" placeholder="numero" />
//                         <input type="text" placeholder="Bairro" />
//                         <input type="text" placeholder="Cidade" />
//                         <input type="text" placeholder="Complemento" />
//                     </div>


//                 </section>

//                 {/* Método de Pagamento */}
//                 <section className={styles.paymentMethod}>
//                     <h2>Método de Pagamento</h2>
//                     <select>
//                         <option>Cartão de Crédito</option>
//                         <option>Dinheiro</option>
//                         <option>Pix</option>
//                     </select>
//                 </section>

//                 {/* Botão para Confirmar o Pedido */}
//                 <button className={styles.confirmButton}>Confirmar Pedido</button>
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default Checkout;


// src/pages/checkout/index.tsx
import React, { useEffect, useState } from 'react';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import logoImg from '../../../public/logo.png';
import styles from './style.module.scss';
import Head from 'next/head';
import { setupAPICliente } from '@/src/services/api';

const Checkout: React.FC = () => {
    const { cart, clearCart } = useCart(); // Trazendo o cart e clearCart do contexto
    const [total, setTotal] = useState(0);
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
    });

    // Converte os valores de `preco` e calcula o total do carrinho
    useEffect(() => {
    const parsedCart = cart.map((item) => ({
        ...item,
        preco: isNaN(Number(item.preco)) ? 0 : Number(item.preco),
        quantidade: isNaN(Number(item.quantidade)) ? 0 : Number(item.quantidade),
    }));

    console.log("Carrinho depois do parse:", parsedCart);

    const totalAmount = parsedCart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    console.log("Total calculado:", totalAmount);

    setTotal(totalAmount);
}, [cart]);


    console.log("Carrinho atualizado:", cart);

    // Função para buscar o CEP
    const handleCepBlur = async () => {
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setAddress({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                });
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                alert("CEP não encontrado. Verifique e tente novamente.");
            }
        }
    };

    // Função para confirmar o pedido
    const handleConfirmOrder = async () => {
        try {
            const order = {
                pessoaId: 1, // Substituir pelo ID real da pessoa
                taxaEntregaId: 1, // Substituir pelo ID real da taxa de entrega
                status: 'Aberto',
                numMesa: 5,
                valTotal: total,
                items: cart.map((item) => ({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    idValor: item.idValor,
                })),
            };

            const apiCliente = setupAPICliente();
            await apiCliente.post('/createPedido', order); // Usando `POST` para criação
            alert('Pedido confirmado!');
            clearCart(); // Limpa o carrinho após confirmar o pedido
        } catch (error) {
            console.error(error);
            alert('Erro ao confirmar o pedido. Tente novamente.');
        }
    };

    return (
        <>
            <Head>
                <title>Carrinho</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image src={logoImg} alt="Logo Pizzaria" width={200} height={100} />
                </div>
                <div className={styles.nav}>
                    <Link href="/" legacyBehavior>
                        <a className={styles.button}>Home</a>
                    </Link>
                </div>
            </header>

            <div className={styles.checkoutContainer}>
                <h1>Finalizar Pedido</h1>

                {/* Resumo do Pedido */}
                <section className={styles.orderSummary}>
                    <h2>Resumo do Pedido</h2>
                    {cart.map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                            <span>{item.nome}</span>
                            <span>{item.tamanho}</span>
                            <span>{item.quantidade}</span>
                            <span>
                                R$ {typeof item.preco === 'number' ? item.preco.toFixed(2) : parseFloat(item.preco).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </section>

                {/* Total do Pedido */}
                <section className={styles.orderTotal}>
                    <p>Total do Pedido: R$ {total.toFixed(2)}</p>
                </section>

                {/* Informações do Cliente */}
                <section className={styles.customerInfo}>
                    <h2>Informações do Cliente</h2>
                    <input type="text" placeholder="Nome" />
                    <input type="text" placeholder="Celular" />

                    <div>
                        <input
                            type="text"
                            placeholder="Cep"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            onBlur={handleCepBlur}
                        />
                        <input type="text" placeholder="Logradouro" value={address.logradouro} readOnly />
                        <input type="text" placeholder="Número" />
                        <input type="text" placeholder="Bairro" value={address.bairro} readOnly />
                        <input type="text" placeholder="Cidade" value={address.cidade} readOnly />
                        <input type="text" placeholder="Complemento" />
                    </div>
                </section>

                {/* Método de Pagamento */}
                <section className={styles.paymentMethod}>
                    <h2>Método de Pagamento</h2>
                    <select>
                        <option>Cartão de Crédito</option>
                        <option>Dinheiro</option>
                        <option>Pix</option>
                    </select>
                </section>

                {/* Botão para Confirmar o Pedido */}
                <button className={styles.confirmButton} onClick={handleConfirmOrder}>
                    Confirmar Pedido
                </button>
            </div>

            <Footer />
        </>
    );
};

export default Checkout;
