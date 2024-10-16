import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { Feather } from '@expo/vector-icons';
import { api } from "../../services/api";
import { ModalPicker } from '../../components/ModalPicker';
import { ListItem } from "../../components/ListItem";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams ={
    Order: {
        number: string | number,
        order_id: string,
    }
}

export type CategoryProps ={
    id: string,
    nome: string,
}

type ProductProps ={
    id: string,
    nome: string,
}

type ItemProps ={
    id: string,
    product_id: string,
    nome: string,
    amount: string | number,
}

type OrderRouteProp = RouteProp<RouteDetailParams, 'Order'>

export default function Order(){
    const route = useRoute<OrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');

    const [items, setItems] = useState<ItemProps[] | []>([]);

    useEffect(() => {
        async function loadInfo(){
            const response = await api.get('/listCategory')
            setCategory(response.data);
            setCategorySelected(response.data[0])
        }
        loadInfo();
    }, [])

    useEffect(() => {
        async function loadProducts(){
            const response = await api.get('/listProduct',{
                params:{
                    category_id: categorySelected?.id
                }
            })
            setProducts(response.data);
            setProductSelected(response.data[0])
        }

        loadProducts();

    }, [categorySelected])

    async function handleCloseOrder(){
        try{
            order_id: route.params?.order_id
            // await api.delete('/order', {
            //     params:{
            //         order_id: route.params?.order_id
            //     }
            // })

            navigation.goBack();

        }catch(err){
            console.log('Erro ao tentar deletar pedido', err)
        }
    }

    function handleChangeCategory(item: CategoryProps){
        setCategorySelected(item);
    }

    function handleChangeProduct(item: ProductProps){
        setProductSelected(item);
    }

    async function handleAdd(){
        if (productSelected?.id) {
            const response = await api.post('/order/add', {
                order_id: route.params?.order_id as string,
                product_id: productSelected?.id as string,
                amount: Number(amount),
            })

            let data = {
                id: response.data.id,
                product_id: productSelected?.id,
                nome: productSelected?.nome,
                amount: amount,
            }

            setItems(oldArray => [data, ...oldArray]);
        }
    }

    async function handleDeleteItem(item_id: string){
        await api.delete('/order/remove',{
            params:{
                item_id: item_id
            }
        })

        // Após remover da apí atualizamos nossa lista com essa remoção
        let removeItem = items.filter(item => {
            return(item.id !== item_id)
        })

        setItems(removeItem);
    }

    function handleFinisOrder(){
        navigation.navigate("FinishOrder", {
            number: route.params.number,
            order_id: route.params.order_id,
        })
    }
    

    return(
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                       <Feather name="trash-2" size={30} color="#ff3f4b"/>
                    </TouchableOpacity>
                )}
            </View>

            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={ ()=> setModalCategoryVisible(true)}>
                    <Text style={{color: '#fff', fontSize: 15}}>
                        {categorySelected?.nome}
                    </Text>
                </TouchableOpacity>
            )}
            
            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={ ()=> setModalProductVisible(true)}>
                    <Text style={{color: '#fff', fontSize: 15}}>
                        {productSelected?.nome}
                    </Text>
                </TouchableOpacity>
            )}
     
            <View style={styles.qtdContainer}>
                <Text style={styles.qtdtext}>Quantidade</Text>
                <TextInput
                    style={[styles.input, {width: '60%', textAlign: 'center'}]}
                    placeholderTextColor="#f0f0f0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, {opacity: items.length === 0 ? 0.3 : 1} ]}
                    disabled={items.length === 0}
                    onPress={handleFinisOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24}}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={ ({item}) => <ListItem data={item} deleteItem={handleDeleteItem}/> }
            />
                

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={ ()=> setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={ handleChangeCategory }
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={ ()=> setModalProductVisible(false)}
                    options={products}
                    selectedItem={ handleChangeProduct }
                />
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%',
    },
    header:{
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 14,
    },
    input: {
        backgroundColor: "#101026",
        borderRadius: 4,
        width: "100%",
        height: 45,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: "#fff",
        fontSize: 20,
        borderWidth: 0.3,
        borderColor: '#8a8a8a',
    },
    qtdContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qtdtext:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff'
    },

    actions:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonAdd:{
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold',
    },

    button:{
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
