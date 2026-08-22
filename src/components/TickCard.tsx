import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function TickCard({ children, cardColor, onPressed }: TickCardProps) {
    const numberOfHoles = 6;
    const holes = new Array(numberOfHoles).fill(0);

    return (
        <TouchableOpacity style={[styles.cardContainer, { backgroundColor: cardColor || '#7e7e7e' }]} onPress={onPressed}>
            <View style={styles.contentContainer}>
            {children}
            </View>

            <View style={styles.scallopContainer}>
            {holes.map((_, index) => (
                <View key={index} style={styles.hole} />
            ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
        width: "100%",
        height: "100%",
        minHeight: 152,
        maxHeight: 152,
        maxWidth: 200,
        borderRadius: 10,
        overflow: "hidden",
        position: 'relative',
    },
    contentContainer: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    scallopContainer: {
        position: 'absolute',
        bottom: -9,
        left: -9,
        right: -9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'visible',
    },
    hole: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F9F9F9',
    },
})

export interface TickCardProps {
    children?: React.ReactNode;
    cardColor?: string;
    date?: Date;
    onPressed?: () => void;
}