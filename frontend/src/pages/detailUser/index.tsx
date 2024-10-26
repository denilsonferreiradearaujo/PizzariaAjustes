import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './style.module.scss';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';
import { toast } from 'react-toastify';

type UserProps = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tipo: string;
};

type UserDetailProps = {
  id: string;
  nome: string;
  email: string;
  genero: string;
  cpf: string;
  dataNasc: string;
  status: string;
  enderecos: any[];
  telefones: {
    telefoneResidencial: string;
    telefoneCelular: string;
  };
};

export default function detailUser() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetailProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const apiClient = setupAPICliente();
        const response = await apiClient.get('/users/:pessoa_id');
        setUsers(response.data);
      } catch (error) {
        toast.error('Erro ao carregar os usuários');
      }
    }
    loadUser();
  }, []);

  async function handleUserDetail(userId: string) {
    try {
      const apiClient = setupAPICliente();
      const response = await apiClient.get(`/users/${userId}`);
      setSelectedUser(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Erro ao carregar os detalhes do usuário');
    }
  }

  return (
    <>
      <Header />
      <Head>
        <title>Lista de Usuários</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Usuários Cadastrados</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.row}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.tipo}</td>
                <td>
                  <button className={styles.buttonDetail} onClick={() => handleUserDetail(user.id)}>
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliente = setupAPICliente(ctx);
  const response = await apiCliente.get('/users/:pessoa_id');

  return {
    props: {
      listUser: response.data,
    },
  };
});
