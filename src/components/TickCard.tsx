import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { VerticalScallop } from './VerticalScallop';

export function TickCard({ children, cardColor, onPressed }: TickCardProps) {
    return (
        <Pressable style={[styles.cardContainer, { backgroundColor: cardColor || '#7e7e7e' }]} onPress={onPressed}>
            <View style={styles.contentContainer}>
            {children}
            </View>

            <VerticalScallop position='bottom'/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
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
})

export interface TickCardProps {
    children?: React.ReactNode;
    cardColor?: string;
    date?: Date;
    onPressed?: () => void;
}