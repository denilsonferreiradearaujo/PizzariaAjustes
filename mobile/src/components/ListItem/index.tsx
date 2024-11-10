import React from "react";
import { View, Text, StyleSheet } from 'react-native'

interface ItemProps {
    data: {
        id: string;
        product_id: string;
        amount: string | number;
    }

}

export function ListItem({ data }: ItemProps) {
    return (
        <View style={styles.constainer}>
            <Text>ITEM DA LISTA</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {

    }
})