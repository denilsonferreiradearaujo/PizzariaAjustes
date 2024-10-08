import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import styles from './styles.module.scss'

import { setupAPICliente } from '@/src/services/api';
import { toast } from 'react-toastify';

import { canSSRAuth } from '@/src/utils/canSSRAuth';

export default function Category(){
    const [nome, setNome] = useState('')

    async function handleRegister(event: FormEvent ){
        event.preventDefault();

        if(nome === ""){
            toast.error('Insira o nome da categoria')
            return;
        }

        const apiCliente = setupAPICliente();
        await apiCliente.post('/category', {
            nome: nome
        })

        toast.success('Categoria cadastrado com sucesso')

        setNome('');
    }

    return(
        <>
        <Head>
            <title>Nova Categoria - Pizzaria</title>
        </Head>

        <div>
            <Header/>

            <main className={styles.container}>
                <h1>Cadastrar categoria</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input 
                        type='text'
                        placeholder='Digite o nome da categoria'
                        className={styles.input}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <button className={styles.buttonAdd} type="submit">
                        Cadastrar
                    </button>
                </form>

            </main>
        
        </div>
        </>
    )
} 

export const getServerSideProps = canSSRAuth( async(ctx) => {
    return{
        props:{}
    }
})