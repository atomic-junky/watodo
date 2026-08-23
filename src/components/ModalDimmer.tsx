import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { screenHeightModal } from '../../constants/taskConstants';
import Dimmer from './Dimmer';

const ModalDimmer = ({ visible, onClose, panelStyle, children }: ModalDimmerProps) => {
    const [mounted, setMounted] = useState(visible);
    const translateY = useRef(new Animated.Value(visible ? 0 : screenHeightModal)).current;

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 280,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: screenHeightModal,
                duration: 220,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setMounted(false);
            });
        }
    }, [visible]);

    if (!mounted) return null;

    return (
        <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
            <Dimmer visible={visible} onPress={onClose} />
            <Animated.View style={[styles.panel, panelStyle, { transform: [{ translateY }] }]}>
                {children}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    panel: {
        marginTop: 100,
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
})

export default ModalDimmer;


interface ModalDimmerProps {
    visible: boolean;
    onClose: () => void;
    panelStyle?: ViewStyle | ViewStyle[];
    children: ReactNode;
}
