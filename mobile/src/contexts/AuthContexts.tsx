import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from '../services/api'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean; // Para saber se o usuário está ou não
    signIn: (credentials: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type UserProps = {
    id: string; //testar
    nome: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    senha: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({
        id: '',
        nome: '',
        email: '',
        token: ''
    })

    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user.nome;// variavel booleana

    useEffect(() => {

        async function getUser() {
            //Pegar os dados salvos do user
            const userInfo = await AsyncStorage.getItem('@sabor&art');
            let hasUser: UserProps = JSON.parse(userInfo || '{}')

            // Verificar se erros as informações dele.

            if (Object.keys(hasUser).length > 0) {
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

                setUser({
                    id: hasUser.id,
                    nome: hasUser.nome,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }

            setLoading(false);

        }
        getUser();

    }, [])

    async function signIn({ email, senha }: SignInProps) {
        setLoadingAuth(true);

        try {
            const response = await api.post('/login', {
                email,
                senha
            })

            //console.log(response.data);

            const { id, nome, token } = response.data;

            const data = {
                ...response.data
            }

            await AsyncStorage.setItem('@sabor&art', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                nome,
                email,
                token,
            })

            setLoadingAuth(false)

        } catch (err) {
            console.log('Erro ao acessar', err);
            setLoadingAuth(false);
        }

    }

    async function signOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser({
                    id: '',
                    nome: '',
                    email: '',
                    token: ''
                })
            })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                signIn,
                loading,
                loadingAuth,
                signOut
            }}>
            {children}
        </AuthContext.Provider>
    )
}