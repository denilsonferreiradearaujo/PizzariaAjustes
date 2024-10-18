import styles from './home.module.scss'; // Certifique-se de que o caminho esteja correto
import Link from 'next/link';
import imgSenai from '../../../public/senai.jpg'
import Image from "next/image";

export function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
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

                <div className={styles.imgSenai}>
                    <Image src={imgSenai} alt="Logo Pizzaria" width={200} height={60} />
                </div>

                <div className={styles.direitos}>
                    <p>&copy; 2024 Sabor&Art. Todos os direitos reservados.</p>
                </div>

            </div>
        </footer>
    );
}
