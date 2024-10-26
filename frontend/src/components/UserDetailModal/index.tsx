import React, { useEffect, useState } from 'react';
import { setupAPICliente } from '../../services/api';

interface UserDetails {
    id: string;
    nome: string;
    email: string;
    genero: string;
    cpf: string;
    dataNasc: string;
    status: boolean;
    enderecos: Array<any>;
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

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
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
                            <p key={index}>{endereco}</p>
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
            </div>
        </div>
    );
};

export default UserDetailModal;
