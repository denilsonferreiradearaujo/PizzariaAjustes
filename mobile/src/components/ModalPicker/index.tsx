import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'

// Importa os tipos de categorias e tamanhos
import { CategoryProps, ProductSizesProps } from '../../pages/Order'

interface ModalPickerProps {
    options: CategoryProps[] | ProductSizesProps[]; // Permite tanto categorias quanto tamanhos
    handleCLoseModal: () => void;
    selectedItem: (item: CategoryProps | ProductSizesProps) => void; // Ajusta para aceitar ambos os tipos
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export function ModalPicker({ options, handleCLoseModal, selectedItem }: ModalPickerProps) {

    function onPressItem(item: CategoryProps | ProductSizesProps){
        selectedItem(item);
        handleCLoseModal();
    }

    const option = options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => onPressItem(item)}>
            <Text style={styles.item}>
                {'nome' in item ? item.nome : item.tamanho} {/* Exibe nome para categoria ou tamanho para tamanhos */}
            </Text>
        </TouchableOpacity>
    ))

    return (
        <TouchableOpacity style={styles.container} onPress={handleCLoseModal}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: WIDTH - 20,
        height: HEIGHT / 5,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4,
    },
    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#8a8a8a'
    },
    item: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})
