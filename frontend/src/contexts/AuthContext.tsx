import { createContext, ReactNode, useState, useEffect } from "react";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from 'next/router';

import { toast } from "react-toastify";

import { api } from "../services/apiCliente";

type AuthContextData = {
    // user: UserProps;
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    forgotPass: (credentials: forgotPassProps) => Promise<void>;
    resetPass: (credentials: resetPassProps) => Promise<void>;
}

type UserProps = {
    id: string;
    nome: string;
    email: string;
}

type SignInProps = {
    email: string;
    senha: string;
}

// Supondo que `SignUpProps` esteja definido em algum lugar, altere a definição:
type SignUpProps = {
    nome: string;
    email: string;
    genero: string;
    dataNasc: string;
    cpf: string;
    tipo: string;
    senha: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string; // Se for opcional
    bairro: string;
    cidade: string;
    uf: string;
    telefoneResidencial: String;
    telefoneCelular: String;
  };
  

type forgotPassProps = {
    email: string;
}

type resetPassProps = {
    senha: string;
    token: string | string[];
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('erro ao deslogar.')
    }
}

export function AuthProvider({ children }: AuthProviderProps){

    // const [user, setUser] = useState<UserProps>();
    const [user, setUser] = useState<UserProps | null>(null);
    const isAuthenticated = !!user;

    useEffect(() => {

        // Pegar o token no cookie

        const {'@nextAuth.token': token} = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const {id, nome, email} = response.data;

                setUser({
                    id,
                    nome,
                    email
                })
            })
            .catch(() => {
                // Se der erro deslogamos o ususario
                signOut();
            })
        }
    }, [])

    async function signIn({email, senha}: SignInProps){
        try{

            const response = await api.post('/login', {
                email,
                senha
            })
            console.log(response.data)

            const {id, nome, token} = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expira em 1 mês
                path: "/"  // Quais caminhos terão acesso ao cookie
            })

            setUser({
                id,
                nome,
                email,
            })

            // Passar para nossas proximas requisições o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Login realizado com sucesso!')

            // Redirecionar o user para aba dahsboard
            Router.push('/dashboard')

        }catch(err){
            toast.error('Erro ao tentar acessar.')
            console.log('Erro ao acessar', err)
        }
    }

    async function signUp ({nome, email, genero, dataNasc, cpf, senha, cep, tipo, logradouro, numero, complemento, bairro, cidade, uf, telefoneResidencial, telefoneCelular}: SignUpProps){
        try{
            const response = await api.post('/users', {
                nome,
                email,
                genero,
                dataNasc,
                cpf,
                tipo,
                senha,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                telefoneResidencial,
                telefoneCelular,
            })

            console.log(response)
            // console.log("Cadastrado com sucesso!")
            toast.success('Conta criada com sucesso!')

            Router.push('/')

        }catch(err){
            toast.error('Erro ao tentar realizar o cadastro.')
            console.log('erro ao cadatrar', err)
        }
    }

    async function forgotPass ({email}: forgotPassProps){
        try{
            const response = await api.post('/forgotPassword', {
                email
            })

            // console.log("Cadastrado com sucesso!")
            toast.success('Email enviado para redefinição da senha!')

            // Redireciona o usuário para a pagina principal
            Router.push('/')

        }catch(err){
            toast.error('Erro ao tentar realizar redefinição da senha.')
            console.log('erro tentar redefinir senha.', err)
        }
    }

    async function resetPass ({senha, token}: resetPassProps){
        try{
            const response = await api.post(`/resetPassword/${token}`, {
                senha
            })

            // console.log("Cadastrado com sucesso!")
            toast.success('Senha redefinida com sucesso!')

            Router.push('/')

        }catch(err){
            toast.error('Erro ao tentar realizar redefinição da senha.');
            console.log('Erro ao tentar redefinir senha.', err);
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp, forgotPass, resetPass }}>
            {children}
        </AuthContext.Provider>
    )
}