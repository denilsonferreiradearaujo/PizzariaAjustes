// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import { Header } from '@/src/components/Header';
// import styles from './style.module.scss';

// import { canSSRAuth } from '@/src/utils/canSSRAuth';
// import { setupAPICliente } from '../../services/api';

// type UserProps = {
//   id: string;
//   nome: string;
//   email: string;
//   cpf: string;
//   tipo: string;
// };

// interface UserListProps {
//   listUsers: UserProps[];  // Prop recebida do getServerSideProps
// }

// export default function UserList({ listUsers }: UserListProps) {
//   const [users, setUsers] = useState<UserProps[]>(listUsers);  // Inicializando com a prop recebida

//   useEffect(() => {
//     async function loadUsers() {
//       try {
//         const apiClient = setupAPICliente();
//         const response = await apiClient.get('/listUsers');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Erro ao carregar os usuários', error);
//       }
//     }

//     loadUsers();
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>Lista de Usuários</title>
//       </Head>

//       <Header />

//       <main className={styles.main}>
//         <div className={styles.container}>
//           <h1>Usuários Cadastrados</h1>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Nome</th>
//                 <th>CPF</th>
//                 <th>Email</th>
//                 <th>Tipo</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(user => (
//                 <tr key={user.id}>
//                   <td>{user.nome}</td>
//                   <td>{user.cpf}</td>
//                   <td>{user.email}</td>
//                   <td>{user.tipo}</td>
//                   <td>
//                     <button className={styles.editButton}>Detalhes do usuário</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </>
//   );
// }

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//   const apiCliente = setupAPICliente(ctx);
//   const response = await apiCliente.get('/listUsers');

//   return {
//     props: {
//       listUsers: response.data,  // Retornando os dados de usuários para a página
//     },
//   };
// });











import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './style.module.scss';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';

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

export default function UserList() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetailProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const apiClient = setupAPICliente();
        const response = await apiClient.get('/listUsers');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar os usuários', error);
      }
    }
    loadUsers();
  }, []);

  async function handleUserDetail(userId: string) {
    try {
      const apiClient = setupAPICliente();
      const response = await apiClient.get(`/users/${userId}`);
      setSelectedUser(response.data);
      setIsModalOpen(true); // Abrir o modal com os detalhes
    } catch (error) {
      console.error('Erro ao carregar os detalhes do usuário', error);
    }
  }

  return (
    <>
      <Header />
      <Head>
        <title>Lista de Usuários</title>
      </Head>
      <div className={styles.container}>
        <h1>Usuários Cadastrados</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              {/* <th>CPF</th> */}
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                {/* <td>{user.cpf}</td> */}
                <td>{user.email}</td>
                <td>{user.tipo}</td>
                <td>
                  <button
                    className={styles.detailButton}
                    onClick={() => handleUserDetail(user.id)}
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para exibir os detalhes do usuário */}
      {isModalOpen && selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Detalhes do Usuário</h2>
            <p><strong>Nome:</strong> {selectedUser.nome}</p>
            <p><strong>CPF:</strong> {selectedUser.cpf}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Gênero:</strong> {selectedUser.genero}</p>
            <p><strong>Data de Nascimento:</strong> {selectedUser.dataNasc}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <h3>Telefones</h3>
            <p><strong>Residencial:</strong> {selectedUser.telefones.telefoneResidencial}</p>
            <p><strong>Celular:</strong> {selectedUser.telefones.telefoneCelular}</p>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliente = setupAPICliente(ctx);
  const response = await apiCliente.get('/listUsers');

  return {
    props: {
      listUsers: response.data,
    },
  };
});
