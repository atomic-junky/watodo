import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Dimmer = ({ visible, intensity = 25, onPress }: DimmerProps) => {
    const [mounted, setMounted] = useState(visible);
    const animatedIntensity = useRef(new Animated.Value(visible ? intensity : 0)).current;

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.timing(animatedIntensity, {
                toValue: intensity,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animatedIntensity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished) setMounted(false);
            });
        }
    }, [visible, intensity]);

    if (!mounted) return null;

    return (
        <Pressable
            style={styles.dimmer}
            onPress={onPress}
        >
            <AnimatedBlurView intensity={animatedIntensity} tint="regular" style={styles.blurview} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    dimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
    },
    blurview: {
        width: '100%',
        height: '100%',
    }
})

export default Dimmer;


interface DimmerProps {
    visible: boolean;
    intensity?: number;
    onPress: () => void;
}
