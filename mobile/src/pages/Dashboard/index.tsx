// import React, { useContext, useState } from "react";
// import {Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
// import Icon from 'react-native-vector-icons/Feather'; // Importa os ícones da Feather

// import { AuthContext } from "../../contexts/AuthContext";

// import { useNavigation } from "@react-navigation/native";

// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { StackParamsList } from "../../routes/app.routes";

// import { api } from "../../services/api";

// export default function Dashboard(){
//     const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

//     const [numMesa, setNumMesa] = useState('');

//     const {signOut} = useContext(AuthContext)

//     async function openOrder(){
//         if(numMesa === ""){
//             alert('Informe o número da mesa.')
//             return;
//         }

//         const response = await api.post('/createPedido', {
//             table: Number(numMesa)
//         })

//         navigation.navigate('Order', {number: numMesa,  order_id: response.data.id});

//         setNumMesa('');
//     }

//     return(
//         <SafeAreaView style={styles.container}>
//             <TouchableOpacity onPress={signOut} style={styles.iconButton}>
//                 <Icon name='log-out' color='#fff' size={24} />
//             </TouchableOpacity> 

//             <Text style={styles.title}>Novo pedido</Text>
//             <TextInput
//                 placeholder="Numero da mesa"
//                 placeholderTextColor="#f0f0f0"
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={numMesa}
//                 onChangeText={setNumMesa}
//             />
//             <TouchableOpacity style={styles.button} onPress={openOrder}>
//                 <Text style={styles.textButton}>Abrir mesa</Text>
//             </TouchableOpacity> 
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 15,
//         backgroundColor: '#1d1d2e',
//     },

//     iconButton: {
//         position: 'absolute',
//         top: 30,
//         right: 20,
//         padding: 10,
//         zIndex: 1, // Garante que o botão fique acima de outros elementos
//     },

//     title:{
//         fontSize: 30,
//         fontWeight: 'bold',
//         color: '#fff',
//         marginBottom: 35,
//     },

//     input:{
//         width: '90%',
//         height: 60,
//         backgroundColor: '#101026',
//         borderRadius: 4,
//         paddingHorizontal: 8,
//         textAlign: 'center',
//         fontSize: 20,
//         color: '#fff',
//     },

//     button: {
//         width: '90%',
//         height: 40,
//         backgroundColor: '#3fffa3',
//         borderRadius: 4,
//         marginVertical: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     textButton:{
//         fontSize: 18,
//         color: '#101026',
//         fontWeight: 'bold',
//     },

// })



import React, { useContext, useState } from "react";
import { Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

import { api } from "../../services/api";

export default function Dashboard(){
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [numMesa, setNumMesa] = useState('');
    const { signOut } = useContext(AuthContext);

    // async function openOrder(){
    //     if (numMesa === "") {
    //         alert('Informe o número da mesa.');
    //         return;
    //     }

    //     const response = await api.post('/createPedido', {
    //         table: Number(numMesa)
    //     });

    //     navigation.navigate('Order', { number: numMesa, order_id: response.data.id });

    //     setNumMesa('');
    // }
    async function openOrder(){
        if(numMesa === ""){
            alert('Informe o número da mesa.');
            return;
        }
    
        // Aqui removemos o envio da requisição para criar um pedido.
        navigation.navigate('Order', { number: numMesa });
    
        // Limpando o campo de número da mesa
        setNumMesa('');
    }

    return(
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
                value={numMesa}
                onChangeText={setNumMesa}
            />
            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.textButton}>Abrir mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e',
    },
    iconButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        padding: 10,
        zIndex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
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
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold',
    },
});
