import React, { FormEvent } from 'react';
import { Footer } from '../../components/Footer';
import styles from './style.module.scss';
import Image from "next/image";
import Link from "next/link";
import logoImg from '../../../public/logo.png';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com'; // Descomente ao usar emailjs / lembre-se de baixar a biblioteca back e front npm install emailjs-com


const Contact: React.FC = () => {
    const enviarEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        // Captura a data e a hora atuais
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString();
        const time = currentDate.toLocaleTimeString();

        // Atualiza os campos ocultos com data e hora
        const dateInput = form.elements.namedItem("date") as HTMLInputElement;
        const timeInput = form.elements.namedItem("time") as HTMLInputElement;
        const requestIdInput = form.elements.namedItem("request_id") as HTMLInputElement;

        dateInput.value = date;
        timeInput.value = time;

        // Gera o número de requisição
        let contadorRequisicao = Number(sessionStorage.getItem('contadorRequisicao')) || 1;

        const gerarNumeroRequisicao = (): string => {
            const hoje = new Date();
            const ano = hoje.getFullYear().toString();
            const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
            const dia = hoje.getDate().toString().padStart(2, '0');
            const numeroRequisicao = `${ano}${mes}${dia}-${contadorRequisicao.toString().padStart(6, '0')}`;

            // Incrementa o contador e salva no sessionStorage
            contadorRequisicao++;
            sessionStorage.setItem('contadorRequisicao', contadorRequisicao.toString());

            return numeroRequisicao;
        };

        const requestId = gerarNumeroRequisicao();
        requestIdInput.value = requestId;

        // Envio via emailjs (descomentar para ativar)

        emailjs
            .sendForm(
                'service_b1wujkg',
                'template_emidah4',
                form,
                '3JaBOCjox6QJDTSxj'
            )
            .then(
                (result) => {
                    console.log("E-mail enviado:", result.text);
                    toast.success("E-mail enviado com sucesso!");
                },
                (error) => {
                    console.error("Erro no envio:", error);
                    toast.error("Erro ao enviar o e-mail. Verifique as configurações.");
                }
            );

        form.reset();
        toast.info("Formulário processado.");
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
                                <a className={styles.nav}>Voltar</a>
                            </Link>
                        </div>
                    </header>
                    <div className={styles.contact}>
                        <h1>Entre em contato pelos nossos canais de opinião</h1>
                        <p className={styles.citacao}>
                            Deixe sua opinião, contato ou sugestão sobre nossos serviços para melhor atendê-lo novamente.
                        </p>

                        <form className={styles.form} onSubmit={enviarEmail}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Preencha seu nome:</label>
                                <input
                                    className={styles.input}
                                    id="name"
                                    name="name"
                                    placeholder="Nome"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Adicione seu e-mail:</label>
                                <input
                                    className={styles.input}
                                    id="email"
                                    name="email"
                                    placeholder="E-mail"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="mensagem">Descrição:</label>
                                <textarea
                                    className={styles.textArea}
                                    id="mensagem"
                                    name="mensagem"
                                    placeholder="Deixe sua mensagem"
                                    required
                                ></textarea>
                            </div>

                            {/* Campos ocultos para data, hora e ID de requisição */}
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

export default Contact;
