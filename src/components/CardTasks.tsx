import { StyleSheet, Text, View } from 'react-native';
import { useTasks } from '../../store/tasksStore';
import { CheckIcon } from './CheckIcon';
import { TicketCard, TicketCardProps } from './TicketCard';

const CardTasks = ({ date, onPressed } : TicketCardProps) => {
    const tasks = useTasks();

    const getRowTextStyle = (task: any) => [
        styles.taskText,
        task.status === "done" && styles.taskTextDone,
    ];

    return (
        <TicketCard cardColor='#b36a94' onPressed={onPressed}>
            <View style={styles.cardContent}>
                {tasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                    .map((task, index) => (
                    <View key={index} style={styles.taskRow}>
                        <View style={styles.checkContainer} >
                        {(task.status === "done") && (
                            <CheckIcon strokeColor="#3A0203" />
                        )}
                        </View>
                        <Text style={getRowTextStyle(task)} numberOfLines={1} ellipsizeMode="tail">{task.title}</Text>
                    </View>
                )) }
            </View>
        </TicketCard>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        width: '100%',
        minWidth: 0,
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    taskRow: {
        width: '100%',
        height: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    checkContainer: {
        transform: [{ scale: 0.8 }],
        width: 13,
    },
    taskText: {
        fontFamily: 'Fredoka-Medium',
        width: '100%',
        minWidth: 0,
        flexShrink: 1,
        color: '#3A0203',
        fontSize: 16,
    },
    taskTextDone: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
});

export default CardTasks;
