import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './styles.module.scss';
import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';

interface TaxaEntrega {
  id: number;
  distanciaMin: string;
  distanciaMax: string;
  valor: string;
}

export default function TaxaEntrega() {
  const [distanciaMin, setDistanciaMin] = useState('');
  const [distanciaMax, setDistanciaMax] = useState('');
  const [valor, setValor] = useState('');
  const [viewTaxaEntrega, setViewTaxaEntrega] = useState<TaxaEntrega[]>([]);
  const [filteredTaxaEntrega, setFilteredTaxaEntrega] = useState<TaxaEntrega[]>([]);

  async function fetchTaxaEntrega() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/taxasEntrega');
    setViewTaxaEntrega(response.data);
    setFilteredTaxaEntrega(response.data);
  }

  useEffect(() => {
    fetchTaxaEntrega();
  }, []);

  useEffect(() => {
    const filtered = viewTaxaEntrega.filter((taxa) => {
      return (
        taxa.distanciaMin.toLowerCase().includes(distanciaMin.toLowerCase()) &&
        taxa.distanciaMax.toLowerCase().includes(distanciaMax.toLowerCase())
      );
    });
    setFilteredTaxaEntrega(filtered);
  }, [distanciaMin, distanciaMax, viewTaxaEntrega]);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (distanciaMin === '' || distanciaMax === '' || valor === '') {
      toast.error('Preencha todos os campos para cadastrar a taxa de entrega');
      return;
    }

    const apiCliente = setupAPICliente();
    await apiCliente.post('/addTaxaEntrega', { distanciaMin, distanciaMax, valor });
    toast.success('Taxa de entrega cadastrada com sucesso');
    setDistanciaMin('');
    setDistanciaMax('');
    setValor('');
    await fetchTaxaEntrega();
  }

  const salvarEdicao = async (id: number, novaDistanciaMin: string, novaDistanciaMax: string, novoValor: string) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.put(`/updateTaxaEntrega/${id}`, { distanciaMin: novaDistanciaMin, distanciaMax: novaDistanciaMax, valor: novoValor });
      toast.success('Taxa de entrega atualizada com sucesso');
      await fetchTaxaEntrega();
    } catch (error) {
      toast.error('Erro ao atualizar a taxa de entrega');
    }
  };

  const handleDelete = async (id: number) => {
    const apiCliente = setupAPICliente();
    try {
      await apiCliente.delete(`/TaxaEntrega/${id}`);
      toast.success('Taxa de entrega excluída com sucesso');
      await fetchTaxaEntrega();
    } catch (error) {
      toast.error('Erro ao excluir a taxa de entrega');
    }
  };

  return (
    <>
      <Head>
        <title>Taxas de Entrega</title>
      </Head>

      <div>
        <Header />
        <div className={styles.container}>
          <h1>Cadastrar ou filtrar uma taxa de entrega</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Distância mínima"
              className={styles.input}
              value={distanciaMin}
              onChange={(e) => setDistanciaMin(e.target.value)}
            />
            <input
              type="text"
              placeholder="Distância máxima"
              className={styles.input}
              value={distanciaMax}
              onChange={(e) => setDistanciaMax(e.target.value)}
            />
            <input
              type="text"
              placeholder="Valor da taxa"
              className={styles.input}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Taxas de Entrega</h2>
          <ul className={styles.list}>
            {filteredTaxaEntrega.length > 0 ? (
              filteredTaxaEntrega.map((taxa) => (
                <li key={taxa.id} className={styles.listItem}>
                  <div>
                    <input
                      type="text"
                      value={taxa.distanciaMin}
                      onChange={(e) => {
                        const updatedTaxa = filteredTaxaEntrega.map((item) => {
                          if (item.id === taxa.id) {
                            return { ...item, distanciaMin: e.target.value };
                          }
                          return item;
                        });
                        setFilteredTaxaEntrega(updatedTaxa);
                      }}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      value={taxa.distanciaMax}
                      onChange={(e) => {
                        const updatedTaxa = filteredTaxaEntrega.map((item) => {
                          if (item.id === taxa.id) {
                            return { ...item, distanciaMax: e.target.value };
                          }
                          return item;
                        });
                        setFilteredTaxaEntrega(updatedTaxa);
                      }}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      value={taxa.valor}
                      onChange={(e) => {
                        const updatedTaxa = filteredTaxaEntrega.map((item) => {
                          if (item.id === taxa.id) {
                            return { ...item, valor: e.target.value };
                          }
                          return item;
                        });
                        setFilteredTaxaEntrega(updatedTaxa);
                      }}
                      className={styles.input}
                    />
                    <button
                      className={styles.buttonEdit}
                      onClick={() => salvarEdicao(taxa.id, taxa.distanciaMin, taxa.distanciaMax, taxa.valor)}
                    >
                      Editar
                    </button>
                    <button className={styles.buttonDelete} onClick={() => handleDelete(taxa.id)}>
                      Excluir
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>Nenhuma taxa de entrega encontrada</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
