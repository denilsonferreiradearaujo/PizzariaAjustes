import styles from './styles.module.scss';

type Size = {
  tamanho: string;
  preco?: string; // Alterado para opcional, será preenchido a partir de `valores`
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
  console.log('Product data:', product);

  const formatPrice = (price: string | number | undefined) => {
    if (price == null || isNaN(Number(price))) {
      return 'R$ 0,00';
    }
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h2 className={styles.modalTitle}>{product.nome}</h2>
        <p className={styles.modalDescription}>{product.descricao || 'Descrição indisponível'}</p>
        <p className = {styles.modalStatus}>Status {product.status}</p>

        {product.tamanhos && product.tamanhos.length > 0 ? (
          <ul className={styles.sizeList}>
            {product.tamanhos.map((size) => {
              const matchingValue = product.valores.find((value) => value.tamanhoId === size.id);
              const price = matchingValue ? matchingValue.preco : undefined;

              console.log(`Tamanho: ${size.tamanho}, Preço: ${price}`);
              return (
                <li key={size.id} className={styles.sizeItem}>
                  <strong>Tamanho:</strong> {size.tamanho} <strong>Preço:</strong> {formatPrice(price)}
                </li>
              );
            })}
          </ul>
        ) : (
          <p><strong>Preço:</strong> Indisponível</p>
        )}
      </div>
    </div>
  );
}
