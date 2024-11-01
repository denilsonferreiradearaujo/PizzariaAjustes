import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { Feather } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { StackParamsList } from "../../routes/app.routes"; 

import { api } from "../../services/api";

type RouteDetailParams = {
    FinishOrder:{
        number: string | number,
        order_id: string,
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder(){
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function handleFinish(){
        try{
            await api.put('/order/send', {
                order_id: route.params.order_id
            })

            navigation.popToTop();
            
        }catch(err){
            console.log('Erro ao tentar finalizar o pedido', err)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.alert}>Deseja finalizar o pedido?</Text>
            <Text style={styles.title}>
                Mesa {route.params?.number}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color="1d1d2e"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alert:{
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#101026',
        marginBottom: 18,
    },
    button:{
        backgroundColor: '#b22222',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },

    buttonHover: {
        transform: [{ scale: 1.4 }] 
    },

    textButton:{
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#101026'
    }
})

