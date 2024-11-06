import React from 'react';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../../../public/logo.png';
import styles from './style.module.scss';

const Checkout: React.FC = () => {
    return (
        <>
            {/* Cabeçalho com logo e navegação */}
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

            {/* Conteúdo do Checkout */}
            <div className={styles.checkoutContainer}>
                <h1>Finalizar Pedido</h1>

                {/* Resumo do Pedido */}
                <section className={styles.orderSummary}>
                    <h2>Resumo do Pedido</h2>
                    <div className={styles.orderItem}>
                        <span>Produto</span>
                        <span>Quantidade</span>
                        <span>Preço</span>
                    </div>
                    {/* Exemplo de item - esses dados virão de um state ou props */}
                    <div className={styles.orderItem}>
                        <span>Pizza Margherita</span>
                        <span>1</span>
                        <span>R$ 40,00</span>
                    </div>
                </section>

                {/* Total do Pedido */}
                <section className={styles.orderTotal}>
                    <h2>Total do Pedido</h2>
                    <p>R$ 40,00</p>
                </section>

                {/* Informações do Cliente */}
                <section className={styles.customerInfo}>
                    <h2>Informações do Cliente</h2>
                    <input type="text" placeholder="Nome" />
                    <input type="text" placeholder="Endereço" />
                    <input type="text" placeholder="Telefone" />
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
                <button className={styles.confirmButton}>Confirmar Pedido</button>
            </div>

            <Footer />
        </>
    );
};

export default Checkout;
