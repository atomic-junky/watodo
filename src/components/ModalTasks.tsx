import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTasksStore } from '../../store/tasksStore';
import { EditTasks, ModalTasksProps, Task } from '../../types/taskTypes';
import { Checkbox } from './Checkbox';

const ModalTasks = ({visible, tasks, onClose, onSuccess, onCreate, onEdit} : ModalTasksProps) => {

    const {addTask, updateTask, deleteTask} = useTasksStore();
    const [data, setData] = useState<EditTasks>({tasks: []});
    const [loading, setLoading] = useState(false);
    const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
    const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
    const inputRefs = useRef<Record<string, TextInput | null>>({});
    const remoteIdMap = useRef<Record<string, string>>({});
    const dataRef = useRef(data);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        setData({tasks: tasks || []})
    }, [tasks, visible]);

    useEffect(() => {
        if (pendingFocusId) {
            inputRefs.current[pendingFocusId]?.focus();
            setPendingFocusId(null);
        }
    }, [pendingFocusId]);

    const resolveId = (id: string) => remoteIdMap.current[id] ?? id;

    const handleInsertAfter = (afterTask?: Task) => {
        const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newTask: Task = {
            id: localId,
            index: (afterTask?.index ?? data.tasks.length) + 1,
            day: afterTask?.day ?? new Date(),
            title: '',
            status: 'todo',
        };

        setData((prev) => {
            const list = [...prev.tasks];
            const insertAt = afterTask ? list.findIndex((t) => t.id === afterTask.id) + 1 : list.length;
            list.splice(insertAt, 0, newTask);
            return { tasks: list };
        });
        setPendingFocusId(localId);

        addTask({ title: newTask.title, index: newTask.index }).then((created) => {
            if (!created) return;
            remoteIdMap.current[localId] = created.id;

            const current = dataRef.current.tasks.find((t) => t.id === localId);
            if (current && (current.title.trim() !== '' || current.status !== 'todo')) {
                updateTask(created.id, { title: current.title.trim(), status: current.status });
            }
        });
    }

    const handleRemove = (task: Task) => {
        setData((prev) => ({ tasks: prev.tasks.filter((t) => t.id !== task.id) }));
        const realId = remoteIdMap.current[task.id] ?? (task.id.startsWith('local-') ? null : task.id);
        if (realId) handleDelete(realId);
    }

    const onCheckboxChange = (task: Task) => {
        task.status = task.status === "todo" ? "done" : "todo";
        handleUpdate(task);
    }

    const onTextInputChange = (task: Task, text: string) => {
        task.title = text;
        handleUpdate(task);
    }

    const handleUpdate = async (task: Task) => {
        const realId = resolveId(task.id);
        if (realId.startsWith('local-')) return;

        setLoading(true);
        try {
            const updatedData: Partial<Task> = {
                title: task.title.trim(),
                status: task.status
            };
            await updateTask(realId, updatedData);
            console.log(`Task with ID ${realId} updated successfully.`);
            onSuccess?.();

        } catch (error) {
            console.error("Error updating tasks: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleAdd = async (task: Task) => {
        setLoading(true);
        try {
            if (task.id) return; // Skip tasks that already exists.

            const newTask = {
                title: task.title.trim(),
                index: task.index,
            };
            await addTask(newTask);
            console.log(`Task with title ${task.title} added successfully.`);

            onSuccess?.();
        } catch (error) {
            console.error("Error adding tasks: ", error);
        } finally {
            setLoading(false);
        }  
    }
    

    const handleDelete = async (taskId: string) => {
        setLoading(true);
        try {
            await deleteTask(taskId);
            console.log(`Task with ID ${taskId} deleted successfully.`);
            onSuccess?.();
        } catch (error) {
            console.error("Error deleting task: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        if (loading) return;
        onClose();
    }

    const getRowStyle = (task: Task, index: number) => [
        styles.row,
        index % 2 === 1 && styles.rowOdd,
    ];

    const getTextInputStyle = (task: Task) => [
        styles.textInput,
        task.status === "done" && styles.textInputDone,
        task.id === focusedTaskId && styles.textInputFocused,
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
            {/* <Dimmer onPress={handleClose} /> */}
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {[...data.tasks]
                        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                        .map((task, index) => (
                        <View key={task.id} style={getRowStyle(task, index)}>
                            <Checkbox
                                checked={task.status === "done"}
                                onChange={() => onCheckboxChange(task)}
                            />
                            <TextInput
                                ref={(input) => {
                                    inputRefs.current[task.id] = input;
                                }}
                                style={getTextInputStyle(task)}
                                value={task.title}
                                onChangeText={(text) => onTextInputChange(task, text)}
                                onSubmitEditing={() => handleInsertAfter(task)}
                                onFocus={() => setFocusedTaskId(task.id)}
                                onBlur={() => setFocusedTaskId((id) => (id === task.id ? null : id))}
                                returnKeyType="next"
                                submitBehavior="submit"
                            />
                            <TouchableOpacity onPress={() => handleRemove(task)} hitSlop={8}>
                                <MaterialIcons name="close" size={20} color="#3A020399" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addRowButton} onPress={() => handleInsertAfter()}>
                        <MaterialIcons name="add" size={20} color="#3A020399" />
                        <Text style={styles.addRowText}>Ajouter une tâche</Text>
                    </TouchableOpacity>
                </ScrollView>

                <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#b06994',
        paddingVertical: 25,
        margin: 0,
        marginTop: "auto",
        marginBottom: "auto",
    },
    scrollView: {
        paddingTop: 100,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 35,
        paddingVertical: 5,
        height: 50,
    },
    rowOdd: {
        backgroundColor: 'rgba(58, 2, 3, 0.12)',
    },
    addRowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    addRowText: {
        fontFamily: "Fredoka-Medium",
        color: '#3A020399',
    },
    textInput: {
        paddingVertical: 10,
        flex: 1,
        fontFamily: "Fredoka-Medium",
        fontSize: 18,
        color: '#3A0203',
    },
    textInputDone: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    textInputFocused: {
        borderRadius: 8,
    },
    doneButton: {
        alignSelf: 'center',
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        backgroundColor: '#FAF8FC',
    },
    doneButtonText: {
        color: '#3A0203',
        fontFamily: "Fredoka-Bold",
    },
})

export default ModalTasks;
