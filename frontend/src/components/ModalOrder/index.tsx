import React from 'react';
import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

interface OrderProps {
    id: string;
    numMesa: number;
    status: string;
    items: { id: string; quantidade: number; Produto: { nome: string; descricao: string; }; }[];
    valorTotal: number | string;
    dataCreate: Date;
    dataUpdate: Date;
}

interface ModalOrderProps {
    isOpen: boolean;
    order: OrderProps;
    onRequestClose: () => void;
}

export function ModalOrder({ isOpen, onRequestClose, order }: ModalOrderProps) {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '0', // Remove padding padrão
            backgroundColor: 'transparent', // Mantém a estilização externa
        },
    };
    

    function formatCurrency(value: number | string): string {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        return numberValue.toFixed(2).replace('.', ',');
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background: 'transparent', border: 0, position: 'absolute', top: '15px', right: '15px' }}
            >
                <FiX size={30} color='#f34748' />
            </button>

            <div className={styles.container}>
                <h2>Detalhes do Pedido - Mesa {order.numMesa}</h2>

                <div className={styles.details}>
                    <span className={styles.table}>Mesa: <strong>{order.numMesa}</strong></span>
                    <span>Status: <strong>{order.status}</strong></span>
                    <span>Total: <strong>R$ {formatCurrency(order.valorTotal)}</strong></span>
                    <span>Data do Pedido: <strong>{new Date(order.dataCreate).toLocaleString()}</strong></span>
                </div>

                <h3>Itens do Pedido:</h3>
                {order.items.map(item => (
                    <section key={item.id} className={styles.containerItem}>
                        <span>{item.quantidade} - <strong>{item.Produto.nome}</strong></span>
                        <span className={styles.description}>{item.Produto.descricao}</span>
                    </section>
                ))}
            </div>
        </Modal>
    );
}
