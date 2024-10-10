import { useContext } from 'react';
import styles from '../Header/style.module.scss';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {
    const { signOut } = useContext(AuthContext)
    // const { user} = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/" legacyBehavior>
                    <a className={styles.voltarHome}>🠔 Voltar para home</a>
                </Link>
                <Link legacyBehavior href='/dashboard'>
                    <img src='/logo.png' width={210} height={80} />
                </Link>

                {/* <h2> Bem vindo(a) {user?.name}! </h2> */}

                <nav className={styles.menuNav}>

                    <Link legacyBehavior href='/category'>
                        <a>Cadastrar Categoria</a>
                    </Link>

                    <Link legacyBehavior href='/product'>
                        <a>Cadastrar Produto</a>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#413F46' size={24} />
                    </button>

                </nav>
            </div>
        </header>
    )
}