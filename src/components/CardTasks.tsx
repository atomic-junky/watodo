import { StyleSheet, Text, View } from 'react-native';
import { useTasks } from '../../store/tasksStore';
import { CheckIcon } from './CheckIcon';
import { TickCard, TickCardProps } from './TickCard';

const CardTasks = ({ date, onPressed } : TickCardProps) => {
    const tasks = useTasks();

    const getRowStyle = (task: any, index: number) => [
        styles.taskRow,
        task.checked && styles.rowDone,
        index % 2 === 1 && styles.taskRowOdd,
    ];

    const getRowTextStyle = (task: any) => [
        styles.taskText,
        task.checked && styles.taskTextDone,
    ];

    return (
        <TickCard cardColor='#b36a94' onPressed={onPressed}>
            <View style={styles.cardContent}>
                {tasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                    .map((task, index) => (
                    <View key={index} style={getRowStyle(task, index)}>
                        <View style={styles.checkContainer} >
                        {(task.status === "done") && (
                            <CheckIcon strokeColor="#fff" />
                        )}
                        </View>
                        <Text style={getRowTextStyle(task)} numberOfLines={1} ellipsizeMode="tail">{task.title}</Text>
                    </View>
                )) }
            </View>
        </TickCard>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        flex: 1,
        width: '100%',
        minWidth: 0,
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: 5,
    },
    taskRow: {
        width: '100%',
        height: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    taskRowOdd: {
        backgroundColor: 'rgba(58, 2, 3, 0.12)',
    },
    rowDone: {
        opacity: 0.5,
    },
    checkContainer: {
        width: 10,
        height: 10,
    },
    taskText: {
        fontFamily: 'Fredoka-Medium',
        width: '100%',
        minWidth: 0,
        flexShrink: 1,
        color: '#FAF8FC',
        fontSize: 12,
    },
    taskTextDone: {
        textDecorationLine: 'line-through',
    },
});

export default CardTasks;
