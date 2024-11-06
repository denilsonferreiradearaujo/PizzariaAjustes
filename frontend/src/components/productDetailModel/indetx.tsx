// Modal - Atualizado
import styles from './styles.module.scss';

type Size = {
  tamanho: string;
  preco: number; // Mudei de string para number
};

type Product = {
  id: string;
  nome: string;
  descricao: string;
  tamanhos?: Size[];
  preco: number; // Mudei de string para number
};

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const formatPrice = (price: number) => { // Atualizei o tipo de entrada
    if (price == null || isNaN(price)) {
      return 'R$ 0,00';
    }
    
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2>{product.nome}</h2>
        <p>{product.descricao}</p>
        
        {product.tamanhos && product.tamanhos.length > 0 ? (
          <ul className={styles.sizeList}>
            {product.tamanhos.map((size, index) => (
              <li key={index} className={styles.sizeItem}>
                <strong>Tamanho:</strong> {size.tamanho} | <strong>Preço:</strong> {formatPrice(size.preco)} 
              </li>
            ))}
          </ul>
        ) : (
          <p><strong>Preço:</strong> {formatPrice(product.preco)}</p>
        )}
      </div>
    </div>
  );
}
