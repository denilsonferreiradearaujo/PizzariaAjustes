import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from 'react-native'

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'
import { api } from "../../services/api";
import { ModalPicker } from '../../components/ModalPicker'
import { ListItem } from '../../components/ListItem'
import { AuthContext } from '../../contexts/AuthContexts'

type RouteDetailParams = {
    Order: {
        number: string | number
    }
}

export type CategoryProps = {
    id: string;
    nome: string;
}

type ProductProps = {
    id: string;
    nome: string;
    valores: ProductSizesProps[]; // Adicione esta linha
}

type ItemProps = {
    id: string;
    product_id: string;
    amount: string | number;
}

type ProductSizesProps = {
    tamanhoId: string;
    tamanho: string,
    id: number,
    preco: number; // Adicione o preço ao tipo
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order() {
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation();

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
    const [modalcategoryVisible, setModalCategoryVisible] = useState(false)

    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [productSize, setProductSize] = useState<ProductSizesProps[] | []>([]);
    const [selectedSizes, setSelectedSizes] = useState<ProductSizesProps | undefined>()
    const [modalProductSize, setModalProductSize] = useState(false)

    const [amount, setAmount] = useState('1')
    const [items, setItems] = useState<ItemProps[]>([]);

    const { user } = useContext(AuthContext)

    // console.log("Usuario: ",user.id);


    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/listCategory')

            console.log(response.data);
            setCategory(response.data)
            setCategorySelected(response.data[0])
        }

        loadInfo();
    }, [])

    useEffect(() => {

        async function loadProducts() {
            const response = await api.get('/produtos', {
                params: {
                    categoriaId: categorySelected?.id
                }
            })

            setProducts(response.data);
            setProductSelected(response.data[0])
            // setProductSize(response.data[0].valores)
            setSelectedSizes(response.data[0].valores)
            console.log(response.data);
            // console.log(response.data[0].valores);

        }

        loadProducts();

    }, [categorySelected])

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/produtos', {
                params: {
                    categoriaId: categorySelected?.id
                }
            });

            setProducts(response.data);
            const firstProduct = response.data[0];
            setProductSelected(firstProduct);
            setSelectedSizes(firstProduct.valores[0]);

            // Atualiza `productSize` com os tamanhos disponíveis do primeiro produto
            setProductSize(firstProduct.valores.map((size: ProductSizesProps) => ({
                tamanhoId: size.tamanhoId,
                tamanho: size.tamanho,
            })));
        }

        loadProducts();
    }, [categorySelected]);

    // Atualiza `productSize` quando o produto selecionado mudar
    useEffect(() => {
        if (productSelected) {
            setProductSize(productSelected.valores.map((size: ProductSizesProps) => ({
                tamanhoId: size.tamanhoId,
                tamanho: size.tamanho,
                preco: size.preco,
                id: size.id
            })));
        }
    }, [productSelected]);

    async function handleCloseOrder() {
        try {
            navigation.goBack()
        } catch (err) {
            console.log(err);
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item);
    }

    async function handleAdd() {

        let data = {
            product_id: productSelected?.id as string,
            nome: productSelected?.nome as string,
            tamanho: selectedSizes?.tamanho as string,
            idValor: selectedSizes?.id as number,
            preco: selectedSizes?.preco as number,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data])

    }

    async function handleDeleteItem(item_id: string) {
        let removeItem = items.filter(item => {
            return (item.product_id !== item_id)
        })

        setItems(removeItem)
    }

    async function handleRealizarPedido() {
        console.log("Itens: ", items);


        // Calcula o valor total do pedido somando o preço de cada item multiplicado pela quantidade     
        const valTotal = items.reduce((acc, item) => {
            const precoTotalItem = parseFloat(item.preco) * parseInt(item.amount);
            return acc + precoTotalItem;
        }, 0);


        const itemsPayload = {
            pessoaId: user.id,
            status: "Aberto",
            numMesa: Number(route.params.number),
            valTotal: valTotal,
            items: items.map(item => ({
                produtoId: item.product_id,
                quantidade: Number(item.amount),
                idValor: selectedSizes?.id,
            }))
        };

        console.log("ASD:  ", itemsPayload);



        await api.post('/createPedido', itemsPayload)
            .then(response => {
                console.log("Response:", response);
            }).catch(error => {
                console.log("Error: ", error);
            })

        // try {
        //   const taxaEntregaId = 1;
        //   const status = "Aberto";
        //   const numMesa = route.params.number;
        //   const valTotal = items.reduce((total, item) => total + item.amount * 10, 0);

        //   const itemsPayload = items.map(item => ({
        //     produtoId: item.product_id,
        //     quantidade: Number(item.amount),
        //     idValor: selectedSizes?.tamanhoId,
        //   }));

        //   const response = await api.post('/createPedido', {
        //     taxaEntregaId,
        //     status,
        //     numMesa,
        //     valTotal,
        //     items: itemsPayload,
        //   });

        //   console.log("Pedido criado com sucesso:", response.data);
        //   alert("Pedido realizado com sucesso!");

        //   navigation.goBack();
        // } catch (error) {
        //   console.error("Erro ao criar pedido:", error);
        //   alert("Erro ao criar pedido: " + error.message);
        // }
    }


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#d41408" />
                    </TouchableOpacity>
                )}
            </View>



            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {categorySelected?.nome}
                    </Text>
                </TouchableOpacity>
            )}

            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {productSelected?.nome}
                    </Text>
                </TouchableOpacity>
            )}

            {productSize.length !== 0 && categorySelected?.nome !== 'Bebidas' && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductSize(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {selectedSizes?.tamanho}

                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.input, { width: '60%', textAlign: 'center' }]}
                    placeholderTextColor="#FFF"
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
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleRealizarPedido}
                >
                    <Text style={styles.buttonText}>Produzir Pedido</Text>
                </TouchableOpacity>
            </View>


            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />



            <Modal
                transparent={false}
                visible={modalcategoryVisible}
                animationType="none"
            >
                <ModalPicker
                    handleCLoseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />

            </Modal>

            <Modal
                transparent={false}
                visible={modalProductVisible}
                animationType="none"
            >

                <ModalPicker
                    handleCLoseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />

            </Modal>

            <Modal
                transparent={false}
                visible={modalProductSize}
                animationType="none"
            >
                <ModalPicker
                    handleCLoseModal={() => setModalProductSize(false)}
                    options={productSize} // Aqui estamos passando as opções de tamanhos.
                    selectedItem={(item) => setSelectedSizes(item as ProductSizesProps)} // Convertendo o item para ProductSizesProps
                />
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%',
        paddingTop: '17%'// iphone
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 14
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 20,
    },
    qtdContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    qtdText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: '#3FD1FF',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#d41408',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})