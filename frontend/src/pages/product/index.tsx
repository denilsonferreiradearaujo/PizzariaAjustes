import { useState, ChangeEvent, FormEvent } from 'react';
import { Footer } from '../../components/Footer';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from '../product/style.module.scss';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';

type ItemProps = {
  id: string;
  nome: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>(''); 
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);
  const [isSizeEnabled, setIsSizeEnabled] = useState(false);

  const [sizes, setSizes] = useState([
    { tamanho: '', preco: '' },
    { tamanho: '', preco: '' },
    { tamanho: '', preco: '' },
  ]);

  const sizeOptions = [
    { value: '', label: 'Selecionar Tamanho' },
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
  ];

  function handleSizeChange(index: number, field: string, value: string) {
    const updatedSizes = [...sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: field === 'preco' ? formatPrice(value) : value,
    };
    setSizes(updatedSizes);
  }

  function formatPrice(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    const numericValue = (parseInt(cleanValue, 10) / 100).toFixed(2);
    return `R$ ${numericValue.replace('.', ',')}`; 
  }

  function parsePriceForSubmission(price: string): string {
    return price.replace(/[^\d,]/g, '').replace(',', '.'); 
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      if (name === '' || description === '' || (!isSizeEnabled && price === '')) {
        toast.error('Preencha todos os campos!');
        return;
      }

      const selectedCategoryId = categories[categorySelected].id;

      const tamanhos = isSizeEnabled
        ? sizes
            .filter(size => size.tamanho !== '' && size.preco !== '') // Certifique-se de que ambos os campos estejam preenchidos
            .map(size => ({
                tamanho: size.tamanho,
            }))
        : null;

      const valores = isSizeEnabled
        ? sizes
            .filter(size => size.tamanho !== '' && size.preco !== '') // Certifique-se de que ambos os campos estejam preenchidos
            .map(size => ({
                preco: parsePriceForSubmission(size.preco),
                tamanhoId: size.tamanho, // Mantenha o nome do tamanho, depois você irá associá-lo ao ID
            }))
        : [];

      const data = {
        nome: name,
        descricao: description,
        categoriaId: parseInt(selectedCategoryId, 10),
        tamanhos,
        valores,
      };

      const apiCliente = setupAPICliente();
      await apiCliente.post('/createProduct', data);

      toast.success('Produto cadastrado com sucesso!');
      setName('');
      setDescription('');
      setPrice('');
      setSizes([{ tamanho: '', preco: '' }, { tamanho: '', preco: '' }, { tamanho: '', preco: '' }]);
    } catch (err) {
      console.log('Erro', err);
      toast.error('Ops! Erro ao cadastrar');
    }
  }

  return (
    <>
      <Head>
        <title>Novo produto - Pizzaria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1 className={styles.titulo}>Novo produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <select
              value={categorySelected}
              onChange={(e) => setCategorySelected(Number(e.target.value))}
              className={styles.select}
            >
              {categories.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.nome}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Descreva o produto"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {!isSizeEnabled && (
              <input
                type="text"
                placeholder="Preço"
                className={styles.input}
                value={price}
                onChange={(e) => setPrice(formatPrice(e.target.value))}
              />
            )}

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={isSizeEnabled}
                onChange={() => setIsSizeEnabled(!isSizeEnabled)}
                id="sizeToggle"
              />
              <label htmlFor="sizeToggle">Adicionar tamanhos e valores</label>
            </div>

            {isSizeEnabled && (
              <>
                <h2 className={styles.titulo}>Tamanhos e Preços</h2>
                {sizes.map((size, index) => (
                  <div key={index} className={styles.sizePriceContainer}>
                    <select
                      value={size.tamanho}
                      onChange={(e) => handleSizeChange(index, 'tamanho', e.target.value)}
                      className={styles.selectSize}
                    >
                      {sizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Preço"
                      className={styles.inputPrice}
                      value={size.preco}
                      onChange={(e) => handleSizeChange(index, 'preco', e.target.value)}
                    />
                  </div>
                ))}
              </>
            )}

            <button className={styles.buttonSubmit} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiCliente = setupAPICliente(ctx);
  const response = await apiCliente.get('/listCategory');

  return {
    props: {
      categoryList: response.data,
    },
  };
});
