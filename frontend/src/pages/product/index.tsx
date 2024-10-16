import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head'
import { Header } from '@/src/components/Header';
import styles from '../product/style.module.scss';
import { toast } from 'react-toastify';

import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';

type ItemProps = {
  id: string,
  name: string
}

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({categoryList}: CategoryProps){
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  // Estados para tamanhos e valores
  const [sizes, setSizes] = useState<string[]>(['']); // Array de strings para tamanhos
  const [values, setValues] = useState<{ preco: string, tamanho: boolean, status: boolean }[]>([
    { preco: '', tamanho: false, status: true }
  ]);

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>){
    setCategorySelected(Number(event.target.value))
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

  async function handleRegister(event: FormEvent){
    event.preventDefault();

    try {
      if(name === "" || price === "" || description === ""){
        toast.error("Preencha todos os campos!");
        return;
      }

      const selectedCategoryId = categories[categorySelected].id;
      
      // Montar os dados a serem enviados
      const data = {
        nome: name,
        categoriaId: parseInt(selectedCategoryId, 10),
        tamanhos: sizes.filter(size => size !== "").map(size => ({ tamanho: size })),
        valores: values.map(value => ({
          preco: parseFloat(value.preco),
          tamanho: value.tamanho,
          status: value.status,
        }))
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
        <Header/>

        <main className={styles.container}>
          <h1>Novo produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            {/* Categoria */}
            <select value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* Nome do Produto */}
            <input
              type='text'
              placeholder='Digite o nome do produto'
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Preço do Produto */}
            <input
              type='text'
              placeholder='Preço do produto'
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* Descrição do Produto */}
            <textarea
              placeholder='Descreva o produto'
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Tamanhos */}
            <h2>Tamanhos</h2>
            {sizes.map((size, index) => (
              <div key={index} className={styles.sizeContainer}>
                <input
                  type='text'
                  placeholder='Tamanho'
                  className={styles.input}
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                />
                <button type='button' onClick={() => removeSizeField(index)}>Remover</button>
              </div>
            ))}
            <button type='button' onClick={addSizeField}>Adicionar Tamanho</button>

            {/* Valores */}
            <h2>Valores</h2>
            {values.map((value, index) => (
              <div key={index} className={styles.valueContainer}>
                <input
                  type='text'
                  placeholder='Preço'
                  className={styles.input}
                  value={value.preco}
                  onChange={(e) => handleValueChange(index, 'preco', e.target.value)}
                />
                <label>
                  <input
                    type='checkbox'
                    checked={value.tamanho}
                    onChange={(e) => handleValueChange(index, 'tamanho', e.target.checked)}
                  />
                  Tamanho
                </label>
                <label>
                  <input
                    type='checkbox'
                    checked={value.status}
                    onChange={(e) => handleValueChange(index, 'status', e.target.checked)}
                  />
                  Ativo
                </label>
                <button type='button' onClick={() => removeValueField(index)}>Remover</button>
              </div>
            ))}
            <button type='button' onClick={addValueField}>Adicionar Valor</button>

            <button className={styles.buttonAdd} type='submit'>
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  )
}

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//   const apiCliente = setupAPICliente(ctx);
//   const response = await apiCliente.get('/createProduct');

//   return {
//     props: {
//       categoryList: response.data
//     }
//   }
// })
