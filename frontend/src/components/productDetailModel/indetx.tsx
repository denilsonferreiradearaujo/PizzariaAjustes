import styles from './styles.module.scss';

type Size = {
  tamanho: string;
  preco: string;
};

type Product = {
  id: string;
  nome: string;
  descricao: string;
  tamanhos?: Size[];
  preco?: string;
};

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{product.nome}</h2>
        <p>{product.descricao}</p>
        
        {product.tamanhos && product.tamanhos.length > 0 ? (
          <ul className={styles.sizeList}>
            {product.tamanhos.map((size, index) => (
              <li key={index} className={styles.sizeItem}>
                <strong>Tamanho:</strong> {size.tamanho} | <strong>Preço:</strong> {size.preco}
              </li>
            ))}
          </ul>
        ) : (
          <p><strong>Preço:</strong> {product.preco}</p>
        )}

        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
}
