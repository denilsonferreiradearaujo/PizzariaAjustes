import React, { useContext, useState } from "react";
import { Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
import Icon from 'react-native-vector-icons/Feather'; // Importa os ícones da Feather

import { AuthContext } from "../../contexts/AuthContext";

import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

import { api } from "../../services/api";
export default function MyButton() {
    const [isPressed, setIsPressed] = useState(false);
}

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [number, setNumber] = useState('');

    const { signOut } = useContext(AuthContext)

    async function openOrder() {
        if (number === "") {
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
            console.error("Erro ao abrir pedido, error");
            alert("Error ao abrir a mesa. Tente novamente");
        }
    }

    function handleSignout() {
        Alert.alert(
            "Sair",
            "Deseja realmente sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => signOut() }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={signOut} style={styles.iconButton}>
                <Icon name='log-out' color='#fff' size={24} />
            </TouchableOpacity>

            <Text style={styles.title}>Novo pedido</Text>
            <TextInput
                placeholder="Numero da mesa"
                placeholderTextColor="#f0f0f0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />
            {/* <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.textButton}>Abrir mesa</Text>
            </TouchableOpacity> */}

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

    iconButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        padding: 10,
        zIndex: 1, // Garante que o botão fique acima de outros elementos
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
        transition: 'transform 0.5s',
    },

    buttonHover: {
        transform: [{ scale: 1.4 }]
    },

    textButton: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold',
    },

})