import { BlurView } from 'expo-blur';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

const Dimmer = ({onPress} : DimmerProps) => {

    return (
        <TouchableWithoutFeedback
            style={styles.dimmer}
            onPress={onPress}
        >
            <BlurView intensity={25} style={styles.blurview} />
        </TouchableWithoutFeedback>
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
    onPress: () => void;
}