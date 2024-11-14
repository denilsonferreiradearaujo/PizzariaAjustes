import { useState } from 'react';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { setupAPICliente } from '@/src/services/api';

type Size = {
  tamanho: string;
  preco?: string;
  id: number;
};

type Value = {
  tamanhoId: number;
  preco: string;
};

type Product = {
  id: string;
  nome: string;
  descricao: string | null;
  tamanhos: Size[];
  valores: Value[];
  status: string;
};

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const [name, setName] = useState(product.nome);
  const [description, setDescription] = useState(product.descricao || '');
  const [status, setStatus] = useState(product.status);
  const [priceValues, setPriceValues] = useState(
    product.valores.map((value) => ({
      tamanhoId: value.tamanhoId,
      preco: value.preco,
    }))
  );

  const formatPrice = (price: string | number | undefined) => {
    if (price == null || isNaN(Number(price))) {
      return 'R$ 0,00';
    }
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  const handleUpdateProduct = async () => {
    const apiCliente = setupAPICliente();
    const updatedProduct = {
      nome: name,
      descricao: description,
      status,
      valores: priceValues.map((value) => ({
        ...value,
        preco: value.preco.replace(',', '.'),
      })),
    };

    try {
      await apiCliente.put(`/updateProduct/${product.id}`, updatedProduct);
      toast.success('Produto atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar o produto');
    }
  };

  const handlePriceChange = (tamanhoId: number, value: string) => {
    setPriceValues((prevPrices) =>
      prevPrices.map((price) =>
        price.tamanhoId === tamanhoId ? { ...price, preco: value } : price
      )
    );
  };

  const handleSinglePriceChange = (value: string) => {
    // Atualiza o preço para o único produto sem tamanhos
    setPriceValues([{ tamanhoId: 0, preco: value }]);
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${product.tamanhos.length === 0 ? styles.noSizes : ''}`}>
        <button onClick={onClose} className={styles.closeButton}>X</button>

        <h2 className={styles.modalTitle}>Editar Produto</h2>

        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />

        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        {product.tamanhos && product.tamanhos.length > 0 ? (
          <>
            <h3>Tamanhos e Preços</h3>
            <ul className={styles.sizeList}>
              {product.tamanhos.map((size) => (
                <li key={size.id} className={styles.sizeItem}>
                  <strong>{size.tamanho}</strong>
                  <input
                    type="text"
                    value={priceValues.find((value) => value.tamanhoId === size.id)?.preco || ''}
                    onChange={(e) => handlePriceChange(size.id, e.target.value)}
                    className={styles.inputPrice}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <label>Preço:</label>
            <input
              type="text"
              value={priceValues[0]?.preco || ''}
              onChange={(e) => handleSinglePriceChange(e.target.value)}
              className={styles.inputPrice2}
            />
          </>
        )}

        <button onClick={handleUpdateProduct} className={styles.buttonSubmit}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
