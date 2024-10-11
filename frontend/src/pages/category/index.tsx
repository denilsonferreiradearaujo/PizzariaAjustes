import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './styles.module.scss';

import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';

import { canSSRAuth } from '@/src/utils/canSSRAuth';

interface Categoria {
  id: number;
  nome: string;
}

export default function Category() {
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Estado para armazenar as categorias
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]); // Estado para armazenar as categorias filtradas

  // Função para buscar as categorias na API
  async function fetchCategorias() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/listCategory');
    setCategorias(response.data);
    setFilteredCategorias(response.data); // Inicialmente, as categorias filtradas são todas
  }

  // useEffect para buscar as categorias quando o componente for montado
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Função para lidar com o filtro de categorias
  useEffect(() => {
    const filtered = categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(nome.toLowerCase()) // Filtra por nome da categoria
    );
    setFilteredCategorias(filtered);
  }, [nome, categorias]);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (nome === '') {
      toast.error('Insira o nome da categoria');
      return;
    }

    const apiCliente = setupAPICliente();
    await apiCliente.post('/category', {
      nome: nome,
    });

    toast.success('Categoria cadastrada com sucesso');
    setNome('');
    await fetchCategorias(); // Atualiza a lista após cadastro
  }

  // Função para salvar a edição
  const salvarEdicao = async (id: number, novoNome: string) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.post(`/updateCategory/${id}`, {
        nome: novoNome,
      });
      toast.success('Categoria atualizada com sucesso');
      await fetchCategorias(); // Atualiza a lista após edição
    } catch (error) {
      toast.error('Erro ao atualizar a categoria');
    }
  };

  return (
    <>
      <Head>
        <title>Nova Categoria - Pizzaria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar ou filtrar uma categoria</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Editar categoria</h2>
          <ul className={styles.list}>
            {filteredCategorias.length > 0 ? (
              filteredCategorias.map((categoria) => (
                <li key={categoria.id}>
                  <div className={styles.form}>
                    <input
                      type="text"
                      value={categoria.nome}
                      onChange={(e) => {
                        const updatedCategorias = categorias.map((cat) => {
                          if (cat.id === categoria.id) {
                            return { ...cat, nome: e.target.value };
                          }
                          return cat;
                        });
                        setCategorias(updatedCategorias);
                      }}
                      className={styles.input}
                    />
                    <button
                      className={styles.buttonAdd}
                      onClick={() => salvarEdicao(categoria.id, categoria.nome)}
                    >
                      Editar
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>Nenhuma categoria encontrada</p>
            )}
          </ul>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
