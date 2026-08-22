import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const CHECK_PATH =
    'M1.50033 11.0001C1.50033 11.0001 3.00033 11.7501 4.50033 14.0001C5.09947 14.8988 6.7651 14.4892 7.01398 13.4381C7.37081 11.9313 7.97553 10.0497 9.00033 8.00009C11.5003 3.00009 13.5003 1.50009 13.5003 1.50009';

export const CheckIcon = ({style, strokeColor="#3A0203"} : CheckIconProps) => {
    return (
        <Svg
            viewBox="0 0 15 16"
            fill="none"
            style={[style, styles.check]}
        >
            <Path d={CHECK_PATH} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
        </Svg>
    )
}

const styles = StyleSheet.create({
    check: {
        width: 15,
        height: 16,
    },
})

interface CheckIconProps {
    style?: object;
    strokeColor?: string;
}