import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Footer } from '../../components/Footer';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from '../product/style.module.scss';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPICliente } from '../../services/api';
import { ProductDetailsModal } from '../../components/productDetailModal';

type ItemProps = {
  id: string;
  categoriaId?: number;
  nome: string;
  descricao: string;
  preco: string;
  tamanhos: Array<{ tamanho: string; preco: string }>;
  status: string;
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
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([{ tamanho: '', preco: '' }, { tamanho: '', preco: '' }, { tamanho: '', preco: '' }]);
  const [productList, setProductList] = useState<ItemProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number>(-1); // -1 significa nenhum filtro
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(''); // Pode ser 'Ativo', 'Inativo' ou vazio
  const [selectedProduct, setSelectedProduct] = useState<ItemProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeOptions = [
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiCliente = setupAPICliente();
      const response = await apiCliente.get('/listProduct');
      setProductList(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSizeChange = (index: number, field: string, value: string) => {
    const updatedSizes = [...sizes];

    // Atualiza o tamanho ou o preço na posição especificada
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: field === 'preco' ? formatPrice(value) : value,
    };

    // Garante que o tamanho selecionado seja único entre os selects
    const uniqueSizes = updatedSizes.map((size, idx) => {
      if (idx !== index && size.tamanho === value && field === 'tamanho') {
        return { ...size, tamanho: '' }; // Remove tamanho duplicado
      }
      return size;
    });

    setSizes(uniqueSizes);
  };

  // Função para gerar opções dinâmicas
  const getFilteredSizeOptions = (index: number) => {
    const selectedSizes = sizes.map((size) => size.tamanho);
  
    const filteredOptions = sizeOptions.filter(
      (option) =>
        !selectedSizes.includes(option.value) || sizes[index].tamanho === option.value
    );
  
    // Adiciona a opção "Sem tamanho selecionado"
    return [{ value: '', label: 'Sem tamanho selecionado' }, ...filteredOptions];
  };
  


  const formatPrice = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    const numericValue = (parseInt(cleanValue, 10) / 100).toFixed(2);
    return `R$ ${numericValue.replace('.', ',')}`;
  };

  const parsePriceForSubmission = (price: string): string => {
    return price.replace(/[^\d,]/g, '').replace(',', '.').replace('R$', '').trim();
  };

  const handleValidation = () => {
    if (name === '') {
      toast.error('O nome do produto é obrigatório!');
      return false;
    }
    if (description === '') {
      toast.error('A descrição do produto é obrigatória!');
      return false;
    }

    if (isSizeEnabled) {
      const tamanhos = sizes.filter(size => size.tamanho && size.preco);
      if (tamanhos.length === 0) {
        toast.error('É necessário adicionar pelo menos um tamanho e preço!');
        return false;
      }
    } else if (price === '') {
      toast.error('O preço é obrigatório se tamanhos não forem adicionados!');
      return false;
    }
    return true;
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!handleValidation()) return;

    const selectedCategoryId = categories[categorySelected].id;
    const tamanhos = isSizeEnabled ? sizes.filter(size => size.tamanho && size.preco) : [];  //tamanhos nunca será null
    const valores = tamanhos.length > 0
      ? tamanhos.map(size => ({ preco: parsePriceForSubmission(size.preco), tamanho: size.tamanho }))
      : [{ preco: parsePriceForSubmission(price) }]; // Caso tamanhos esteja vazio, mantemos o preço padrão

    const data = {
      nome: name,
      descricao: description,
      categoriaId: parseInt(selectedCategoryId, 10),
      tamanhos: tamanhos.length > 0 ? tamanhos : undefined, // Exclui tamanhos se estiver vazio
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
      await fetchProducts();
    } catch (error: any) {
      const errorMessage = error.response ? error.response.data.message : 'Erro desconhecido';
      toast.error(`Erro ao cadastrar: ${errorMessage}`);
    }
  };

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
                      {getFilteredSizeOptions(index).map((option) => (
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

          {/* Campo de filtros */}
          <div className={styles.filtersContainer}>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              className={styles.input}
              value={searchTerm} // Use searchTerm para a pesquisa
              onChange={(e) => setSearchTerm(e.target.value)} // Atualiza searchTerm conforme o usuário digita
            />

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(Number(e.target.value))}
              className={styles.select}
            >
              <option value={-1}>Todas as Categorias</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Lista de produtos */}
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <ul>
              {productList
                .filter((product) => {
                  // Filtro de categoria
                  if (selectedCategoryFilter !== -1 && product.categoriaId !== selectedCategoryFilter) {
                    return false;
                  }

                  // Filtro de status
                  if (selectedStatusFilter && product.status !== selectedStatusFilter) {
                    return false;
                  }

                  // Filtro de pesquisa por nome
                  return product.nome.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map((product) => (
                  <li
                    key={product.id}
                    className={styles.productItem}
                    onClick={() => handleProductClick(product)}
                  >
                    <h2>{product.nome}</h2>

                    {/* Exibe o status do produto com a cor apropriada */}
                    <p className={product.status === 'Ativo' ? styles.statusAtivo : styles.statusInativo}>
                      {product.status}
                    </p>

                    <p>{product.descricao}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>

      </main>
      <Footer />

      {isModalOpen && selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={closeModal} onUpdate={fetchProducts}>
          <h2>{selectedProduct.nome}</h2>
          <p>{selectedProduct.descricao}</p>
          {selectedProduct.tamanhos && (
            <ul>
              {selectedProduct.tamanhos.map((size, index) => (
                <li key={index}>
                  {size.tamanho} - {size.preco}
                </li>
              ))}
            </ul>
          )}
          {!selectedProduct.tamanhos && <p>Preço: {selectedProduct.preco}</p>}
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