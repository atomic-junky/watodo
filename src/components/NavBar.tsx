import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function buildBarPath(width: number) {
    const middle = width / 2; // 201
    const slope_height = Math.min(31, Math.max(25.361, 25 - (width - 400) / 20)); // Adjust the slope height based on width

    return `
        M${middle+87.519} ${slope_height}
        C${middle+60.902} 24.0386 ${middle+29.548} 1.12304 ${middle+2.92} 0.0581316
        C${middle+1} 0 ${middle} 0 ${middle-1} 0
        C${middle-1} 0 ${middle-1.955} 0.0195741 ${middle-2.92} 0.0581318
        C${middle-29.548} 1.12304 ${middle-60.902} 24.0386 ${middle-87.519} ${slope_height}
        L${50} 31
        H${width-50}
        L${middle+87.519} ${slope_height}
        Z
    `;
}

export function NavBar({
    onPressAdd,
}: NavBarProps) {
    const [width, setWidth] = useState(0);

    return (
        <View
            style={styles.container}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        >
            {width > 0 && (
                <Svg
                    width={width}
                    height={31}
                    viewBox={`0 0 ${width} 31`}
                    fill="none"
                    style={styles.svg}
                >
                    <Path d={buildBarPath(width)} fill={"#602244"} />
                </Svg>
            )}
            <View style={styles.base}>

            </View>

            <TouchableOpacity
                style={styles.bumpButton}
                onPress={onPressAdd}
            >
                <MaterialIcons name="add" color={"#602244"} size={42} />
            </TouchableOpacity>
        </View>
    );
}

export interface NavBarProps {
    onPressAdd?: () => void;
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    svg: {
        transform: [{ scaleY: 1.1 }],
    },
    bumpButton: {
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
        backgroundColor: '#F9F9F9',
        borderRadius: 42.5,
        left: '50%',
        transform: [{ translateX: -45 }, { translateY: 8 }],
        shadowColor: '#000',
    },
    base: {
        minHeight: 90,
        backgroundColor: '#602244',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    }
});
