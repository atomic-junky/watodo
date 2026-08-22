import { useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

const HOLE_SPACING = 38;
const HOLE_SIZE = 18;

export function VerticalScallop({ position = 'top', color = '#F9F9F9', style }: VerticalScallopProps) {
    const [width, setWidth] = useState(0);
    const numberOfHoles = width > 0 ? Math.max(2, Math.round(width / HOLE_SPACING) + 1) : 6;
    const holes = new Array(numberOfHoles).fill(0);

    return (
        <View
            style={[
                styles.scallopContainer,
                position === 'top' ? { top: -HOLE_SIZE / 2 } : { bottom: -HOLE_SIZE / 2 },
                style,
            ]}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        >
        {holes.map((_, index) => (
            <View key={index} style={[styles.hole, { backgroundColor: color }]} />
        ))}
        </View>
    );
}

export interface VerticalScallopProps {
    position?: 'top' | 'bottom';
    color?: string;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    scallopContainer: {
        position: 'absolute',
        left: -HOLE_SIZE / 2,
        right: -HOLE_SIZE / 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'visible',
    },
    hole: {
        width: HOLE_SIZE,
        height: HOLE_SIZE,
        borderRadius: HOLE_SIZE / 2,
        backgroundColor: '#F9F9F9',
    },
});