// pages/privacy.tsx
import React from 'react';
import styles from './privacy.module.scss'; // Crie um arquivo SCSS para estilização, se necessário

const PrivacyPolicy: React.FC = () => {
    return (
        <div className={styles.privacyContainer}>
            <h1>Política de Privacidade</h1>
            <p>Esta é a nossa política de privacidade. Aqui você encontrará informações sobre como coletamos, usamos e protegemos seus dados.</p>
            {/* Adicione mais conteúdo sobre sua política de privacidade aqui */}
        </div>
    );
};

export default PrivacyPolicy;
