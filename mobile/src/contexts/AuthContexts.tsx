import React, { useState, createContext, ReactNode } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from '../services/api'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean; // Para saber se o usuário está ou não
    signIn: (credentials: SignInProps) => Promise<void>;
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

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({
        id: '',
        nome: '',
        email: '',
        token: ''
    })

    const [loadingAuth, setLoadingAuth] = useState(false)

    const isAuthenticated = !!user.nome;// variavel booleana

    async function signIn({ email, senha }: SignInProps) {
        setLoadingAuth(true);

        try{
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

        }catch(err){
            console.log('Erro ao acessar', err);
            setLoadingAuth(false);
        }

    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}