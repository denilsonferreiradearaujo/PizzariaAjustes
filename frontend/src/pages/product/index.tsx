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
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  const [sizes, setSizes] = useState<string[]>(['']);
  const [values, setValues] = useState<{ preco: string; tamanho: boolean; status: boolean }[]>([
    { preco: '', tamanho: false, status: true },
  ]);

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(Number(event.target.value));
  }

  function handleSizeChange(index: number, value: string) {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  }

  function handleValueChange(index: number, field: string, value: any) {
    const updatedValues = [...values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setValues(updatedValues);
  }

  function addSizeField() {
    setSizes([...sizes, '']);
  }

  function removeSizeField(index: number) {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  }

  function addValueField() {
    setValues([...values, { preco: '', tamanho: false, status: true }]);
  }

  function removeValueField(index: number) {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      if (name === '' || price === '' || description === '') {
        toast.error('Preencha todos os campos!');
        return;
      }

      const selectedCategoryId = categories[categorySelected].id;

      const data = {
        nome: name,
        descricao: description,
        categoriaId: parseInt(selectedCategoryId, 10),
        tamanhos: sizes.filter((size) => size !== '').map((size) => ({ tamanho: size })),
        valores: values.map((value) => ({
          preco: parseFloat(value.preco),
          tamanho: value.tamanho,
          status: value.status,
        })),
      };

      const apiCliente = setupAPICliente();
      await apiCliente.post('/createProduct', data);

      toast.success('Produto cadastrado com sucesso!');
      setName('');
      setPrice('');
      setDescription('');
      setSizes(['']);
      setValues([{ preco: '', tamanho: false, status: true }]);
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
            <select value={categorySelected} onChange={handleChangeCategory} className={styles.select}>
              {categories.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.nome}
                </option>
              ))}
            </select>

            <input
              type='text'
              placeholder='Digite o nome do produto'
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type='text'
              placeholder='Preço do produto'
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              placeholder='Descreva o produto'
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h2 className={styles.titulo}>Tamanhos</h2>
            {sizes.map((size, index) => (
              <div key={index} className={styles.sizeContainer}>
                <input
                  type='text'
                  placeholder='Tamanho'
                  className={styles.input}
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                />
                {/* <button type='button' className={styles.buttonRemove} onClick={() => removeSizeField(index)}>
                  Remover
                </button> */}
              </div>
            ))}
            {/* <button type='button' className={styles.buttonAdd} onClick={addSizeField}>
              Adicionar Tamanho
            </button> */}

            <h2 className={styles.titulo}>Valores</h2>
            {values.map((value, index) => (
              <div key={index} className={styles.valueContainer}>
                <input
                  type='text'
                  placeholder='Preço'
                  className={styles.input}
                  value={value.preco}
                  onChange={(e) => handleValueChange(index, 'preco', e.target.value)}
                />
                
                {/* <button type='button' className={styles.buttonRemove} onClick={() => removeValueField(index)}>
                  Remover
                </button> */}
              </div>
            ))}
            {/* <button type='button' className={styles.buttonAdd} onClick={addValueField}>
              Adicionar Valor
            </button> */}

            <button className={styles.buttonSubmit} type='submit'>
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
