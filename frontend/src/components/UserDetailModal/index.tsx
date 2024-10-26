import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { setupAPICliente } from '../../services/api';
import styles from './styles.module.scss';

interface UserDetails {
    id: string;
    nome: string;
    email: string;
    genero: string;
    cpf: string;
    dataNasc: string;
    status: boolean;
    enderecos: Array<{
        id: string;
        pessoaId: string;
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        uf: string;
        dataCreate: string;
        dataUpdate: string;
    }>;
    telefones: {
        Telefone: {
            telefoneResidencial: string;
            telefoneCelular: string;
        };
    }[];
}

interface UserDetailModalProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, isOpen, onClose }) => {
    const customStyles = {
        content: {
            color: '#1e1e2e',
            border: '1px solid #000000',
            borderRadius: '0.5rem',
            width: '40%',
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(70%, -50%)',
            backgroundColor: '#fff'
        }
    };
    
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    useEffect(() => {
        if (isOpen) {
            handleUserDetail();
        }
    }, [isOpen]);

    const handleUserDetail = async () => {
        try {
            const apiCliente = setupAPICliente();
            const response = await apiCliente.get(`/users/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error("Erro ao buscar os detalhes do usuário:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Detalhes do Usuário"
            className="modal-content"
            overlayClassName="modal-overlay"
            style={customStyles}
        >
            <button className="modal-close" onClick={onClose}>Fechar</button>
            {userDetails ? (
                <div>
                    <h2>Detalhes do Usuário</h2>
                    <p><strong>Nome:</strong> {userDetails.nome}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Gênero:</strong> {userDetails.genero}</p>
                    <p><strong>CPF:</strong> {userDetails.cpf}</p>
                    <p><strong>Data de Nascimento:</strong> {userDetails.dataNasc}</p>
                    <p><strong>Status:</strong> {userDetails.status ? 'Ativo' : 'Inativo'}</p>
                    <h3>Endereços</h3>
                    {userDetails.enderecos.map((endereco, index) => (
                        <div key={index}>
                            <p><strong>CEP:</strong> {endereco.cep}</p>
                            <p><strong>Logradouro:</strong> {endereco.logradouro}</p>
                            <p><strong>Número:</strong> {endereco.numero}</p>
                            <p><strong>Complemento:</strong> {endereco.complemento || 'N/A'}</p>
                            <p><strong>Bairro:</strong> {endereco.bairro}</p>
                            <p><strong>Cidade:</strong> {endereco.cidade}</p>
                            <p><strong>UF:</strong> {endereco.uf}</p>
                        </div>
                    ))}
                    <h3>Telefones</h3>
                    {userDetails.telefones.map((telefone, index) => (
                        <div key={index}>
                            <p><strong>Residencial:</strong> {telefone.Telefone.telefoneResidencial}</p>
                            <p><strong>Celular:</strong> {telefone.Telefone.telefoneCelular}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Carregando detalhes...</p>
            )}
        </Modal>
    );
};

export default UserDetailModal;
