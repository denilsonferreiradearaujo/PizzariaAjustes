import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Footer } from '../../components/Footer';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from '../product/style.module.scss';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';
import { ProductDetailsModal } from '../../components/productDetailModal/index';

type ItemProps = {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  tamanhos: Array<{ tamanho: string; preco: string }>;
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

  const [productList, setProductList] = useState<ItemProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ItemProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeOptions = [
    { value: '', label: 'Selecionar Tamanho' },
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
  ];

  async function fetchProducts() {
    const apiCliente = setupAPICliente();
    const response = await apiCliente.get('/listProduct');
    setProductList(response.data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

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

    if (name === '') {
      toast.error('O nome do produto é obrigatório!');
      return;
    }
    if (description === '') {
      toast.error('A descrição do produto é obrigatória!');
      return;
    }

    // Verifica se tamanhos estão habilitados e se pelo menos um tamanho e preço foram preenchidos
    if (isSizeEnabled) {
      const tamanhos = sizes.filter(size => size.tamanho && size.preco);
      if (tamanhos.length === 0) {
        toast.error('É necessário adicionar pelo menos um tamanho e preço!');
        return;
      }
    } else if (price === '') {
      toast.error('O preço é obrigatório se tamanhos não forem adicionados!');
      return;
    }

    const selectedCategoryId = categories[categorySelected].id;

    const tamanhos = isSizeEnabled
      ? sizes.filter(size => size.tamanho && size.preco)
      : null;

    const valores = isSizeEnabled && tamanhos
      ? tamanhos.map(size => ({
        preco: parsePriceForSubmission(size.preco),
        tamanho: size.tamanho,
      }))
      : [{ preco: parsePriceForSubmission(price) }];

    const data = {
      nome: name,
      descricao: description,
      categoriaId: parseInt(selectedCategoryId, 10),
      tamanhos,
      valores,
    };

    const apiCliente = setupAPICliente();
    try {
      await apiCliente.post('/createProduct', data);
      toast.success('Produto cadastrado com sucesso!');
      setName('');
      setDescription('');
      setPrice('');
      setSizes([{ tamanho: '', preco: '' }, { tamanho: '', preco: '' }, { tamanho: '', preco: '' }]);
      await fetchProducts(); // Agora fetchProducts está disponível
    } catch (error: any) {
      const errorMessage = error.response ? error.response.data.message : 'Erro desconhecido';
      toast.error(`Erro ao cadastrar: ${errorMessage}`);
    }
  }

  const handleProductClick = (product: ItemProps) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Head>
        <title>Novo produto - Pizzaria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.formContainer}>
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
                        placeholder={size.tamanho ? 'Preço' : 'Sem tamanho selecionado'}
                        className={styles.inputPrice}
                        value={size.preco}
                        onChange={(e) => handleSizeChange(index, 'preco', e.target.value)}
                        disabled={!size.tamanho}
                      />
                    </div>
                  ))}
                </>
              )}

              <button className={styles.buttonSubmit} type="submit">
                Cadastrar
              </button>
            </form>
          </div>

          <div className={styles.productListContainer}>
            <h1 className={styles.titulo}>Produtos Cadastrados</h1>
            <ul>
              {productList.map((product) => (
                <li key={product.id} className={styles.productItem} onClick={() => handleProductClick(product)}>
                  <h2>{product.nome}</h2>
                  <p>{product.descricao}</p>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <Footer />

      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={closeModal}>
          <h2>{selectedProduct.nome}</h2>
          <p>{selectedProduct.descricao}</p>
          <h3>Preços:</h3>
          {selectedProduct.tamanhos && selectedProduct.tamanhos.length > 0 ? (
            selectedProduct.tamanhos.map((size) => (
              <div key={size.tamanho}>
                {size.tamanho}: R$ {size.preco}
              </div>
            ))
          ) : (
            <div>Sem tamanhos disponíveis</div>
          )}
        </ProductDetailsModal>
      )}
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