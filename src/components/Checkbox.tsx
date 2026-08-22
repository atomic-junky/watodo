import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CheckIcon } from './CheckIcon';

export interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    color?: string;
}


export function Checkbox({
    checked,
    onChange,
    disabled = false,
    color = '#FAF8FC'
}: CheckboxProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}
            disabled={disabled}
            onPress={() => onChange(!checked)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            hitSlop={8}
            style={styles.main}
        >
            <View
                style={[
                    styles.box,
                    checked && styles.boxChecked,
                    disabled && styles.boxDisabled,
                ]}
            >
                {checked && (
                    <CheckIcon style={styles.check} />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 2,
    },
    box: {
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF8FC',
        borderRadius: 5,
    },
    boxChecked: {
    },
    boxDisabled: {
        opacity: 0.4,
    },
    check: {
        position: 'absolute',
        transform: [{ translateX: 2 }, { translateY: -4 }],
    },
});

export default Checkbox;
