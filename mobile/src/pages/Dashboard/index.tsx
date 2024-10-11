import React, { useContext, useState } from "react";
import { Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Button, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather'; // Importa os ícones da Feather

import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

import { api } from "../../services/api";

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const { user, signOut } = useContext(AuthContext)

    const [number, setNumber] = useState('');
    const [isPressed, setIsPressed] = useState(false);


    async function openOrder() {
        if (number === " ") {
            alert('Informe o número da mesa.')
            return;
        }

        try {
            const response = await api.post('/order', {
                table: Number(number)
            })

            navigation.navigate('Order', { number: number, order_id: response.data.id });
            setNumber('');
        } catch (error) {
            // console.error("Erro ao abrir pedido, error");
            alert("Error ao abrir a mesa. Tente novamente");
        }
    }

    function handleSignout() {
        Alert.alert(
            "Já vai? que pena :(",
            "Deseja realmente sair?",
            [
                { text: "Permanecer", style: "cancel" },
                { text: "Sair", onPress: () => signOut() }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.nameUser}>Bem vindo, {user?.nome}!</Text>

                <TouchableOpacity onPress={handleSignout} style={styles.iconButton}>
                    <Icon name='log-out' color='#b22222' size={24} />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Novo pedido</Text>
            <TextInput
                placeholder="Numero da mesa"
                placeholderTextColor="#f0f0f0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity
                style={[styles.button, isPressed && styles.buttonHover]}
                onPressIn={() => setIsPressed(true)}  // Quando o usuário pressiona o botão
                onPressOut={() => setIsPressed(false)} // Quando o usuário solta o botão
                onPress={openOrder}
            >
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#ffffff',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        left: 10,
        marginBottom: 190,
    },

    iconButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
        bottom: 10,
        zIndex: 1, // Garante que o botão fique acima de outros elementos
    },

    nameUser: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101026',
        marginBottom: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#101026',
        marginBottom: 35,
    },

    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
    },

    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#b22222',
        borderRadius: 20,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonHover: {
        transform: [{ scale: 1.4 }]
    },

    textButton: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold',
    },

});