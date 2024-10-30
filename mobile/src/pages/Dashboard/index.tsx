import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Button } from 'react-native'

import { AuthContext } from '../../contexts/AuthContexts'

import { useNavigation } from '@react-navigation/native'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackPramsList } from '../../routes/app.routes'

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    const [number, setNumber] = useState('');

    async function openOrder() {
        if (number === '') {
            return;
        }

        navigation.navigate('Order', { number: number })
    }

    const { signOut } = useContext(AuthContext)
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>

            <TextInput
                placeholder="Número da mesa"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir Mesa</Text>
            </TouchableOpacity>
            
             <Button
            title='Sair do App'
            onPress={signOut}
            />  

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFFFFF'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#d41408',
        marginBottom: 24,
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: "#101026",
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 21,
        color: '#FFF',
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#d41408',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold'
    }
})