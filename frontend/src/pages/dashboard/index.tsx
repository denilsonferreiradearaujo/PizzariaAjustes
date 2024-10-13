import { useState, useEffect } from "react";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "@/src/components/Header";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPICliente } from '../../services/api';

type OrderItemProps = {
    id: string,
    quantidade: number,
    Produto: {
        id: string,
        nome: string,
        preco: number,
        tamanho: string,
    }
};

type OrderProps = {
    id: string,
    Pessoa: string,
    numMesa: number,
    status: string,
    draft: boolean,
    name: string | null,
    items: OrderItemProps[];
    dataCreate: Date,
    dataUpdate: Date,
    valTotal: string,
}

interface HomeProps {
    orders: OrderProps[];
}

export default function DashBoard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || []);

    // Atualiza a lista de pedidos
    async function handleRefresh() {
        const apiCliente = setupAPICliente();
        const response = await apiCliente.get('/listPedidos');
        console.log(response.data); // Adicione isso para verificar os dados
        setOrderList(response.data);
    }

    async function handleFinishItem(id: string) {
        const apiCliente = setupAPICliente();
        await apiCliente.put(`/pedido/status/${id}`, { status: "Finalizado" });
        handleRefresh(); // Chama a atualização da lista de pedidos após finalizar um pedido
    }

    // Usar useEffect para atualizar a página automaticamente a cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 10000); // 10000ms = 10 segundos

        // Limpar o intervalo quando o componente for desmontado
        return () => clearInterval(interval);
    }, []);

    // Filtrar pedidos em aberto e finalizados
    const pedidosEmAberto = orderList.filter(item => item.status === 'Aberto');
    const pedidosFinalizados = orderList.filter(item => item.status === 'Finalizado');

    console.log('Pedidos em Aberto:', pedidosEmAberto);
    console.log('Pedidos Finalizados:', pedidosFinalizados);

    return (
        <>
            <Head>
                <title>Painel - Pizzaria</title>
            </Head>

            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Acompanhamento dos pedidos</h1>
                        <button onClick={handleRefresh}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>

                    <div className={styles.headColumns}>
                        <div className={styles.column}>
                            <h2>Pedidos em Aberto:</h2>
                            {pedidosEmAberto.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido em aberto...</span>
                            ) : (
                                pedidosEmAberto.map(item => (
                                    <section key={item.id} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>Número da Mesa / Pedido: {item.numMesa}</h3>
                                            <button
                                                className={styles.finishButton}
                                                onClick={() => handleFinishItem(item.id)}
                                            >
                                                Finalizar
                                            </button>
                                        </div>
                                        {/* Exibir atributos adicionais */}
                                        <p className={styles.cardText}>Data de Criação: {new Date(item.dataCreate).toLocaleString()}</p>
                                        {item.items.map((produto: OrderItemProps) => (
                                            <div key={produto.id} className={styles.produtoItem}>
                                                <p className={styles.cardText}>Produto: {produto.Produto.nome}</p>
                                                <p className={styles.cardText}>Quantidade: {produto.quantidade}</p>
                                                <p className={styles.cardText}>Valor: R$ {parseFloat(item.valTotal).toFixed(2)}</p>
                                                <p className={styles.cardText}>Tamanho: {produto.Produto.tamanho}</p>
                                            </div>
                                        ))}
                                    </section>
                                ))
                            )}
                        </div>

                        <div className={styles.column}>
                            <h2>Pedidos Finalizados:</h2>
                            {pedidosFinalizados.length === 0 ? (
                                <span className={styles.emptyList}>Nenhum pedido finalizado...</span>
                            ) : (
                                pedidosFinalizados.map(item => (
                                    <section key={item.id} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>Número da Mesa / Pedido: {item.numMesa}</h3>
                                        </div>
                                        {/* Exibir atributos adicionais */}
                                        <p className={styles.cardText}>Data de Criação: {new Date(item.dataCreate).toLocaleString()}</p>
                                        <p className={styles.cardText}>Data de Atualização: {item.dataUpdate ? new Date(item.dataUpdate).toLocaleString() : ''}</p>
                                        {item.items.map((produto: OrderItemProps) => (
                                            <div key={produto.id} className={styles.produtoItem}>
                                                <p className={styles.cardText}>Produto: {produto.Produto.nome}</p>
                                                <p className={styles.cardText}>Quantidade: {produto.quantidade}</p>
                                                <p className={styles.cardText}>Valor: R$ {parseFloat(item.valTotal).toFixed(2)}</p>
                                                <p className={styles.cardText}>Tamanho: {produto.Produto.tamanho}</p>
                                            </div>
                                        ))}
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiCliente = setupAPICliente(ctx);
    const response = await apiCliente.get('/listPedidos');

    return {
        props: {
            orders: response.data
        }
    };
});
