import styles from './home.module.scss'; // Certifique-se de que o caminho esteja correto
import Link from 'next/link';

export function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <p>&copy; 2024 Sabor&Art. Todos os direitos reservados.</p>
                <nav className={styles.footerNav}>
                    <Link legacyBehavior href='/privacy'>
                        <a>Política de Privacidade</a>
                    </Link>
                    <Link legacyBehavior href='/terms'>
                        <a>Termos de Serviço</a>
                    </Link>
                    <Link legacyBehavior href='/contact'>
                        <a>Contato</a>
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
