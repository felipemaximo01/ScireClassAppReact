import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Line } from 'react-native-svg';

const { width } = Dimensions.get('window')
WIDTH = width - 80
export const InputRange = (minValue, maxValue, onChangeMin, onChangeMax) => {
    return <View style={styles.container}>
        <View style={styles.trilho} />
        <View style={{ position: 'absolute' }}><Svg height="6" width={WIDTH}>

            <Line stroke="#cafe45" strokeWidth={12} x1={0} y1={0} x2={WIDTH} y2={0} />
        </Svg></View>

    </View>
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 40,
        justifyContent: "center"
    },
    trilho: {
        backgroundColor: "#05251",
        position: 'absolute',
        height: 6,
        borderRadius: 6,
        width: WIDTH
    }
})

