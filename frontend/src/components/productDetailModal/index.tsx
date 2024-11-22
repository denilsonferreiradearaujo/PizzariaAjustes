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
  tamanhoId: number | null;
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
  onUpdate: () => void;
}

export function ProductDetailsModal({ product, onClose, onUpdate }: ProductDetailsModalProps) {
  const [name, setName] = useState(product.nome);
  const [description, setDescription] = useState(product.descricao || '');
  const [status, setStatus] = useState(product.status);
  const [priceValues, setPriceValues] = useState(
    product.valores.map((value) => ({
      tamanhoId: value.tamanhoId,
      preco: value.preco.replace('.', ','), // Exibe com vírgula para o usuário
    }))
  );

  const handleMaskedPriceChange = (tamanhoId: number, rawValue: string) => {
    let value = rawValue.replace(/\D/g, '');
    value = (Number(value) / 100).toFixed(2).replace('.', ',');

    setPriceValues((prevPrices) =>
      prevPrices.map((price) =>
        price.tamanhoId === tamanhoId ? { ...price, preco: value } : price
      )
    );
  };

  const handleSinglePriceChange = (rawValue: string) => {
    let value = rawValue.replace(/\D/g, '');
    value = (Number(value) / 100).toFixed(2).replace('.', ',');

    setPriceValues([{ tamanhoId: null, preco: value }]);
  };

  const handleUpdateProduct = async () => {
    const apiCliente = setupAPICliente();
    const updatedProduct = {
      nome: name,
      descricao: description,
      status,
      valores: priceValues.map((value) => ({
        ...value,
        preco: value.preco.replace(',', '.'), // Substitui vírgula por ponto antes de enviar
      })),
    };

    try {
      await apiCliente.put(`/updateProduct/${product.id}`, updatedProduct);
      toast.success('Produto atualizado com sucesso!');
      onUpdate(); // Atualiza a lista de produtos
      onClose(); // Fecha o modal
    } catch (error) {
      toast.error('Erro ao atualizar o produto');
    }
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
                  <div className={styles.priceInputContainer}>
                    <span className={styles.currencySymbol}>R$</span>
                    <input
                      type="text"
                      value={priceValues.find((value) => value.tamanhoId === size.id)?.preco || ''}
                      onChange={(e) => handleMaskedPriceChange(size.id, e.target.value)}
                      className={styles.inputPrice}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <label className={styles.precoTitle}>Preço:</label>
            <div className={styles.productPrice}>
              <span className={styles.currencySymbol}>R$</span>
              <input
                type="text"
                value={priceValues[0]?.preco || ''}
                onChange={(e) => handleSinglePriceChange(e.target.value)}
                className={styles.inputPrice2}
              />
            </div>
          </>
        )}

        <button onClick={handleUpdateProduct} className={styles.buttonSubmit}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
