
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
                        <a className={styles.a}>Home</a>
                    </Link>
                </div>
            </header>
            <div className={styles.privacyContainer}>
                <h1>Entrem contato pelos nossos canais de opnião</h1>
                <p>Deixe sua opinão, contato ou sugestão sobre nossos serviços para melhor atende-lo novamente.</p>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label >Preencha seu nome:</label>
                        <input className={styles.input} for="name" id="name" name-="name" placeholder="Nome" required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label  >Adcione seu e-mail:</label>
                        <input className={styles.input} for="email" id="email" name-="email" placeholder="E-mail" required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label  >Descrição:</label>
                        <textarea
                            className={styles.textArea}
                            id="mensagem"
                            name="mensagem"
                            placeholder="Deixe sua mensagem"
                            required
                        ></textarea>
                    </div>
                    <button className={styles.button} type="submit">Enviar</button>

                    <p><em>Servi bem para servi sempre</em></p>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;