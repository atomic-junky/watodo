import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TASK_COLORS, TASK_FREQUENCY } from '../../constants/taskConstants';
import { useHabitsStore } from '../../store/habitStore';
import { HabitColor, HabitFrequency, ModalHabitProps } from '../../types/habitTypes';
import Dimmer from './Dimmer';

const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
};

const ModalHabits = ({ visible, habit, onClose, onSuccess }: ModalHabitProps) => {
    const { addHabit, updateHabit, deleteHabit } = useHabitsStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [frequency, setFrequency] = useState<HabitFrequency>('daily');
    const [color, setColor] = useState<HabitColor | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(visible);
    const scale = useRef(new Animated.Value(visible ? 1 : 0.9)).current;

    useEffect(() => {
        setTitle(habit?.title ?? '');
        setDescription(habit?.description ?? '');
        setCategory(habit?.category ?? '');
        setFrequency(habit?.frequency ?? 'daily');
        setColor(habit?.color);
    }, [habit, visible]);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.parallel([
                Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scale, { toValue: 0.9, duration: 150, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            ]).start(({ finished }) => {
                if (finished) setMounted(false);
            });
        }
    }, [visible]);

    const handleClose = () => {
        if (loading) return;
        onClose();
    }

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === '') return;

        setLoading(true);
        try {
            if (habit) {
                await updateHabit(habit.id, {
                    title: trimmedTitle,
                    description: description.trim(),
                    category: category.trim(),
                    frequency,
                    color,
                });
            } else {
                const created = await addHabit({
                    title: trimmedTitle,
                    description: description.trim(),
                    category: category.trim(),
                    frequency,
                    color,
                });
                if (!created) return;
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error saving habit: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!habit) return;

        setLoading(true);
        try {
            await deleteHabit(habit.id);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error deleting habit: ", error);
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) return null;

    return (
        <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
            <Dimmer visible={visible} onPress={handleClose} />
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Nom de l'habitude"
                    placeholderTextColor="#3A020366"
                    editable={!loading}
                />
                <TextInput
                    style={styles.descriptionInput}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    placeholderTextColor="#3A020366"
                    multiline
                    editable={!loading}
                />
                <TextInput
                    style={styles.categoryInput}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Catégorie"
                    placeholderTextColor="#3A020366"
                    editable={!loading}
                />

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Fréquence</Text>
                    <View style={styles.frequencyRow}>
                        {TASK_FREQUENCY.map((freq) => (
                            <TouchableOpacity
                                key={freq}
                                style={[styles.frequencyPill, frequency === freq && styles.frequencyPillSelected]}
                                onPress={() => setFrequency(freq)}
                                disabled={loading}
                            >
                                <Text style={[styles.frequencyPillText, frequency === freq && styles.frequencyPillTextSelected]}>
                                    {FREQUENCY_LABELS[freq]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Couleur</Text>
                    <View style={styles.colorRow}>
                        {TASK_COLORS.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.colorSwatch, { backgroundColor: c }, color === c && styles.colorSwatchSelected]}
                                onPress={() => setColor(c)}
                                disabled={loading}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.actionsRow}>
                    {habit && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
                            <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.saveButton, title.trim() === '' && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading || title.trim() === ''}
                    >
                        <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '85%',
        maxWidth: 380,
        borderRadius: 30,
        backgroundColor: '#FAF8FC',
        padding: 25,
        gap: 15,
    },
    titleInput: {
        fontFamily: "Fredoka-Bold",
        fontSize: 20,
        color: '#3A0203',
    },
    descriptionInput: {
        fontFamily: "Fredoka-Medium",
        fontSize: 15,
        color: '#3A0203',
        minHeight: 40,
        textAlignVertical: 'top',
    },
    categoryInput: {
        fontFamily: "Fredoka-Medium",
        fontSize: 15,
        color: '#3A0203',
    },
    fieldGroup: {
        gap: 8,
    },
    fieldLabel: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: 13,
        color: '#3A020399',
    },
    frequencyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    frequencyPill: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(250, 248, 252, 0.5)',
    },
    frequencyPillSelected: {
        backgroundColor: '#3A0203',
    },
    frequencyPillText: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: 13,
        color: '#3A0203',
    },
    frequencyPillTextSelected: {
        color: '#FAF8FC',
    },
    colorRow: {
        flexDirection: 'row',
        gap: 10,
    },
    colorSwatch: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSwatchSelected: {
        borderColor: '#3A0203',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    deleteButtonText: {
        fontFamily: "Fredoka-SemiBold",
        color: '#7A1F1F',
    },
    saveButton: {
        marginLeft: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        backgroundColor: '#FAF8FC',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#3A0203',
        fontFamily: "Fredoka-Bold",
    },
})

export default ModalHabits;
