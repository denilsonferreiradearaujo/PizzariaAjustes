import styles from './home.module.scss'; // Certifique-se de que o caminho esteja correto
import Link from 'next/link';
import imgSsaborEArt from '../../../public/logoFooter.png'
import imgTwitter from '../../../public/logo-twitter.png'
import imgWhatsapp from '../../../public/logo-whatsapp.png'
import imgInstagram from '../../../public/logo-instagram.png'
import imgTiktok from '../../../public/logo-tiktok.png'
import Image from "next/image";

export function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <nav className={styles.footerNav}>
                    <Link legacyBehavior href='/privacy'>
                        <a>Política de Privacidade</a>
                    </Link>
                    <Link legacyBehavior href='/contact'>
                        <a>Contato</a>
                    </Link>
                </nav>

                <div className={styles.imgSenai}>
                    <Image src={imgSsaborEArt} alt="Logo Pizzaria" width={300} height={170} />
                </div>

                <div className={styles.imgSocial}>
                    <p>Conheça a Sabor&Arts em outras redes sociais</p>

                    <div className="social-icons">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rdsocial">
                            <Image src={imgInstagram} alt="Instagram" width={60} height={60} />
                        </a>

                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="rdsocial">
                            <Image src={imgTiktok} alt="TikTok" width={50} height={50} />
                        </a>

                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rdsocial">
                            <Image src={imgTwitter} alt="Twitter" width={50} height={50} />
                        </a>

                        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="rdsocial">
                            <Image src={imgWhatsapp} alt="WhatsApp" width={50} height={50} />
                        </a>
                    </div>
                </div>

                <div className={styles.direitos}>
                    <p>&copy; 2024 Sabor&Art. Todos os direitos reservados.</p>
                </div>

            </div>
        </footer>
    );
}
