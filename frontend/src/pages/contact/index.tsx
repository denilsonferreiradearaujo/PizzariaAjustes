
import React from 'react'
import { Footer } from '../../components/Footer';
import styles from './style.module.scss'
import Image from "next/image";
import Link from "next/link";
import logoImg from '../../../public/logo.png';

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image src={logoImg} alt="Logo Pizzaria" width={200} height={100} />
                </div>
                <div className={styles.nav}>

                    <Link href="/" legacyBehavior>
                        <a className={styles.button}>Home</a>
                    </Link>

                </div>
            </header>
            <div className={styles.privacyContainer}>
                <h1>Política de Privacidade – Sabor & Arte Pizzaria</h1>
                <p>
                    A Sabor & Arte Pizzaria valoriza a privacidade de seus usuários e está comprometida em proteger os dados pessoais que coleta e processa, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais. Ao utilizar nossos serviços, você aceita as práticas descritas nesta política.
                </p>

                <h2>1. Dados Coletados</h2>
                <p>
                    Coletamos dados pessoais fornecidos diretamente por você, como nome, endereço, telefone, e-mail e informações de pagamento, para o processamento de pedidos, cadastro de usuários e para melhorarmos sua experiência. Dados de navegação, como endereço IP, tipo de navegador e padrões de uso em nosso site também podem ser coletados automaticamente.
                </p>

                <h2>2. Finalidade do Uso dos Dados</h2>
                <p>
                    Utilizamos as informações para:
                </p>
                <ul>
                    <li>Processamento e entrega de pedidos</li>
                    <li>Comunicação sobre seu pedido ou conta</li>
                    <li>Melhoria dos nossos serviços e personalização da experiência do usuário</li>
                    <li>Cumprimento de obrigações legais e regulatórias</li>
                </ul>

                <h2>3. Compartilhamento de Dados</h2>
                <p>
                    Seus dados poderão ser compartilhados com prestadores de serviço e parceiros confiáveis que auxiliam no processamento de pedidos, entrega, pagamento e suporte ao cliente. Exigimos que todos os nossos parceiros e prestadores cumpram com os requisitos de proteção de dados.
                </p>

                <h2>4. Retenção e Segurança dos Dados</h2>
                <p>
                    Mantemos suas informações apenas pelo tempo necessário para cumprir as finalidades mencionadas nesta política e de acordo com as exigências legais. Empregamos medidas de segurança, como criptografia e controle de acesso, para proteger os dados de acessos não autorizados, perdas ou alterações.
                </p>

                <h2>5. Direitos dos Titulares de Dados</h2>
                <p>
                    Nos termos da LGPD, você possui os seguintes direitos:
                </p>
                <ul>
                    <li>Acessar e corrigir seus dados pessoais</li>
                    <li>Solicitar a exclusão de dados desnecessários ou excessivos</li>
                    <li>Revogar seu consentimento e solicitar a portabilidade dos dados, conforme aplicável</li>
                </ul>
                <p>
                    Para exercer seus direitos, você pode entrar em contato conosco pelo e-mail <strong>contato@saborearte.com.br</strong>.
                </p>

                <h2>6. Alterações desta Política</h2>
                <p>
                    Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que consulte esta página regularmente para estar ciente de quaisquer mudanças.
                </p>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;