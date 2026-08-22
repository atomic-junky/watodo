import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { VerticalScallop } from './VerticalScallop';

export function TickCard({ children, cardColor, onPressed }: TickCardProps) {
    return (
        <Pressable style={[styles.cardContainer, { backgroundColor: cardColor || '#7e7e7e' }]} onPress={onPressed}>
            <View style={styles.contentContainer}>
            {children}
            </View>

            <View style={styles.rowBackground}>
                {
                    [...Array(7).keys()].map((i) => (
                        <View key={i} style={[styles.row, i % 2 === 1 && styles.rowOdd]} />
                    ))
                }
            </View>

            <VerticalScallop position='bottom'/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: "100%",
        height: "100%",
        minHeight: 168,
        maxHeight: 168,
        maxWidth: 200,
        borderRadius: 10,
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
        zIndex: 2,
    },
    rowBackground: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    },
    row: {
        width: '100%',
        height: 24,
    },
    rowOdd: {
        backgroundColor: 'rgba(58, 2, 3, 0.12)',
    },
})

export interface TickCardProps {
    children?: React.ReactNode;
    cardColor?: string;
    date?: Date;
    onPressed?: () => void;
}