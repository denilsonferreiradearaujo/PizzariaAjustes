import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { AuthContext } from "../../contexts/AuthContext"

export default function SignIn() {
  const { signIn, loadingAuth, errorMessage, clearError } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  useEffect(() => {
    // Limpa a mensagem de erro ao alterar os campos de email ou senha
    clearError();
  }, [email, senha]);

  async function handleLogin() {
    // Função auxiliar para validar o formato do email
    function isValidEmail(email: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Função auxiliar para validar a força da senha
    function isValidPassword(password: string) {
      const minLength = 6;
      // const passwordRegex =
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return password.length >= minLength; // passwordRegex.test(password)
    }

    if (email === "" || senha === "") {
      // Verificação se email ou senha estão vazios
      Alert.alert('Preencha os campos email e senha.')
      return;
      
    }

    if (!isValidEmail(email)) {
      // Verificação de formato de email
      Alert.alert("Erro", "Formato de email inválido!");
      return;
    }

    if (!isValidPassword(senha)) {
      // Verificação de força da senha
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

    // neste passo devemos colocar um comando apos a validação, apos receber o token redirecionar para uma pagina
    const teste = await signIn({ email, senha });

  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo02.png")} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#101026"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="sua senha"
          placeholderTextColor="#101026"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color="#fff"/>
          ): (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
      
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text> // Exibe a mensagem de erro
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    marginBottom: 18,
    height: 120,
    width: 340,
  },

  inputContainer: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 34,
    paddingHorizontal: 14,
  },

  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#d4d3d2",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: "#101026",
    borderWidth: 0.3,
    borderColor: '#8a8a8a',
  },

  button: {
    width: "95%",
    height: 40,
    backgroundColor: "#b22222",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",

  },

  // button: hover {
  //   transform: scale(1.1);
  //   transition: all 0.5s;
  // },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101026",
  },

  errorMessage: {
    fontSize: 13,
    // fontWeight: "bold",
    color: "#fff",
    paddingTop: 8,
  }
});
