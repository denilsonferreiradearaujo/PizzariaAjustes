import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { setupAPICliente } from '../../services/api';
import { toast } from 'react-toastify';
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
    // const customStyles = {
    //     content: {
    //         color: '#1e1e2e',
    //         border: '1px solid #000000',
    //         borderRadius: '0.5rem',
    //         width: '55%',
    //         top: '50%',
    //         bottom: 'auto',
    //         left: '50%',
    //         right: 'auto',
    //         padding: '30px',
    //         transform: 'translate(40%, -100%)',
    //         backgroundColor: '#fff'
    //     }
    // };

   

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [formData, setFormData] = useState<UserDetails | null>(null);

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
            setFormData(response.data); // Initialize formData with user details
        } catch (error) {
            console.error("Erro ao buscar os detalhes do usuário:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value === 'Ativo' ? true : value === 'Inativo' ? false : value // Trata a conversão do status
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            try {
                const apiCliente = setupAPICliente();
                await apiCliente.put(`/users/${formData.id}`, formData);
                toast.success('Edições ralizadas com sucesso!');
                // Optionally close the modal or refresh data after update
                onClose();

            } catch (error) {
                toast.error('Erro ao tentar editar o dados do usuário');
                console.error("Erro ao atualizar os detalhes do usuário:", error);
            }
        }
    };

    return (
        // <Modal
        //     isOpen={isOpen}
        //     onRequestClose={onClose}
        //     contentLabel="Detalhes do Usuário"
        //     className="modal-content"
        //     overlayClassName="modal-overlay"
        //     style={customStyles}
        // >

        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Detalhes do Usuário"
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            {userDetails ? (
                <form onSubmit={handleSubmit}>
                    <h2>Detalhes do Usuário</h2>
                    <label>
                        Nome:
                        <input type="text" name="nome" value={formData?.nome || ''} onChange={handleChange} className={styles.label}/>
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData?.email || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Gênero:
                        <select name="genero" value={formData?.genero || ''} onChange={handleChange}>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outros">Outros</option>
                        </select>
                    </label>
                    <label>
                        CPF:
                        <input type="text" name="cpf" value={formData?.cpf || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Data de Nascimento:
                        <input type="date" name="dataNasc" value={formData?.dataNasc || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Status:
                        <select name="status" value={formData?.status ? 'Ativo' : 'Inativo'} onChange={handleChange}>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </label>
                    <div className={styles.addressGroup}>
                        <h3>Endereços</h3>
                        {userDetails.enderecos.map((endereco, index) => (
                            <div key={index}>
                                <label>
                                    CEP:
                                    <input type="text" name={`cep_${index}`} value={formData?.enderecos[index]?.cep || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Logradouro:
                                    <input type="text" name={`logradouro_${index}`} value={formData?.enderecos[index]?.logradouro || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Número:
                                    <input type="text" name={`numero_${index}`} value={formData?.enderecos[index]?.numero || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Complemento:
                                    <input type="text" name={`complemento_${index}`} value={formData?.enderecos[index]?.complemento || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Bairro:
                                    <input type="text" name={`bairro_${index}`} value={formData?.enderecos[index]?.bairro || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Cidade:
                                    <input type="text" name={`cidade_${index}`} value={formData?.enderecos[index]?.cidade || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    UF:
                                    <input type="text" name={`uf_${index}`} value={formData?.enderecos[index]?.uf || ''} onChange={handleChange} />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className={styles.phoneGroup}>
                        <h3>Telefones</h3>
                        {userDetails.telefones.map((telefone, index) => (
                            <div key={index}>
                                <label>
                                    Residencial:
                                    <input type="text" name={`telefoneResidencial_${index}`} value={formData?.telefones[index].Telefone.telefoneResidencial || ''} onChange={handleChange} />
                                </label>
                                <label>
                                    Celular:
                                    <input type="text" name={`telefoneCelular_${index}`} value={formData?.telefones[index].Telefone.telefoneCelular || ''} onChange={handleChange} />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.saveButton}>Salvar</button>
                        <button type="button" className={styles.closeButton} onClick={onClose}>Fechar</button>
                    </div>
                </form>
            ) : (
                <p>Carregando detalhes...</p>
            )}
        </Modal>
    );
};

export default UserDetailModal;
