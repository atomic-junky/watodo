import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../../types/habitTypes';
import { CheckIcon } from './CheckIcon';

const HabitRow = ({ date, habit, onPressed, onLongPress } : HabitRowProps) => {
    const done: boolean = habit.doneHistory && habit.doneHistory[date.getDay()] ? true : false;

    const getHistoryItemStyle = (index: number) => {
        return [
            styles.habitHistoryItem,
            habit.doneHistory && habit.doneHistory[index] && styles.habitHistoryItemDone,
            // Highlight the item that reprents the date passed as a prop
            habit.doneHistory && habit.doneHistory[index] && date.toDateString() === new Date().toDateString() && styles.habitHistoryItemToday,
        ]
    }

    return (
        <Pressable onPress={onPressed} onLongPress={onLongPress} style={styles.habitRow}>
            <View style={styles.habitCheckboxContainer}>
                {done && (
                    <CheckIcon style={styles.check} />
                )}
            </View>

            <View style={styles.habitContent}>
                <Text style={styles.habitTitle} numberOfLines={1} ellipsizeMode="tail">
                    {habit.title}
                </Text>
            </View>

            <View style={styles.habitHistoryContainer}>
                {
                    [...Array(7)].map((_, index) => (
                        <View key={index} style={getHistoryItemStyle(index)} />
                    ))
                }
                <View key={7} style={[styles.habitHistoryItem, styles.habitHistoryItemToday]} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    habitRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 10,
        backgroundColor: '#9BAFEA',
        width: '100%',
        borderRadius: 10,
        minHeight: 42,
    },
    habitCheckboxContainer: {
        width: 14,
        height: 14,
        borderRadius: 5,
        backgroundColor: '#7495D8',
    },
    habitContent: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: 18,
    },
    habitTitle: {
        fontFamily: 'Fredoka-SemiBold',
        fontSize: 15,
        color: '#3A0203',
    },
    habitHistoryContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    habitHistoryItem: {
        width: 8,
        height: 8,
        borderRadius: 3,
        backgroundColor: '#E6EBFA',
    },
    habitHistoryItemDone: {
        backgroundColor: '#7495D8',
    },
    habitHistoryItemToday: {
        width: 12,
        height: 12,
    },
    check: {
        position: 'absolute',
        transform: [{ translateX: 3 }, { translateY: -4 }, { scale: 1.2 }],
    },

})

export default HabitRow;

interface HabitRowProps {
    date: Date;
    habit: Habit;
    onPressed?: () => void;
    onLongPress?: () => void;
}