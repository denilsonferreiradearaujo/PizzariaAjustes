import React from 'react';
import emailjs from 'emailjs-com';
import { Footer } from '../../components/Footer';
import styles from './style.module.scss';
import Image from "next/image";
import Link from "next/link";
import logoImg from '../../../public/logo.png';
import { toast } from 'react-toastify';

const PrivacyPolicy: React.FC = () => {
    const enviarEmail = (e) => {
        e.preventDefault();

        // Capture a data e a hora atuais
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString();
        const time = currentDate.toLocaleTimeString();

        e.target.date.value = date;
        e.target.time.value = time;

        let contadorRequisicao = Number(sessionStorage.getItem('contadorRequisicao')) || 1;

        function gerarNumeroRequisicao() {
            const hoje = new Date();
            const ano = hoje.getFullYear().toString().padStart(4, '0');  // 'yy'
            const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');  // 'mm'
            const dia = hoje.getDate().toString().padStart(2, '0');  // 'dd'

            // Concatena data com contador crescente
            const numeroRequisicao = `${ano}${mes}${dia}-${contadorRequisicao.toString().padStart(6, '0')}`;

            // Incrementa o contador e armazena
            contadorRequisicao++;
            sessionStorage.setItem('contadorRequisicao', contadorRequisicao);

            return numeroRequisicao;
        }

        // Exemplo de uso
        const requestId = gerarNumeroRequisicao();

        // Atribui o request_id para o campo oculto (ou diretamente no formulário)
        e.target.request_id.value = requestId;

        // Adicione data e hora como parâmetros extras
        emailjs
            .sendForm(
                'service_srx9ckq',
                'template_emidah4',
                e.target,
                '3JaBOCjox6QJDTSxj',
            )
            .then(
                (result) => {
                    console.log(result.text);
                    toast.success("E-mail enviado com sucesso!");
                },
                (error) => {
                    console.log(error.text);
                    toast.error("Houve um erro ao enviar o e-mail. Tente novamente.");
                }
            );

        e.target.reset();
    };

    return (
        <>
            <main className={styles.container}>
                <div className={styles.formContainer}>
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
                        <h1>Entre em contato pelos nossos canais de opinião</h1>
                        <p className={styles.citacao}>Deixe sua opinião, contato ou sugestão sobre nossos serviços para melhor atendê-lo novamente.</p>

                        <form className={styles.form} onSubmit={enviarEmail}>
                            <div className={styles.formGroup}>
                                <label>Preencha seu nome:</label>
                                <input
                                    className={styles.input}
                                    id="name"
                                    name="name"
                                    placeholder="Nome"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Adicione seu e-mail:</label>
                                <input
                                    className={styles.input}
                                    id="email"
                                    name="email"
                                    placeholder="E-mail"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descrição:</label>
                                <textarea
                                    className={styles.textArea}
                                    id="mensagem"
                                    name="mensagem"
                                    placeholder="Deixe sua mensagem"
                                    required
                                ></textarea>
                            </div>

                            {/* Campos ocultos para data e hora */}
                            <input type="hidden" name="date" />
                            <input type="hidden" name="time" />
                            <input type="hidden" name="request_id" />

                            <button className={styles.button} type="submit">
                                Enviar
                            </button>

                            <p><em>Servir bem para servir sempre</em></p>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
