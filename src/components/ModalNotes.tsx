import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNotesStore } from '../../store/notesStore';
import { ModalNotesProps } from '../../types/notesTypes';
import ModalDimmer from './ModalDimmer';

const ModalNotes = ({ visible, notes, day, onClose, onSuccess }: ModalNotesProps) => {
    const { addNotes, updateNotes, deleteNotes } = useNotesStore();
    const [text, setText] = useState(notes?.text ?? '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setText(notes?.text ?? '');
    }, [notes, visible]);

    useEffect(() => {
        // Delete notes if the text is empty and notes exist
        if (notes && text.trim() === '') {
            deleteNotes(day);
        }
    }, [text, notes]);

    const handleClose = async () => {
        const trimmed = text.trim();
        if (trimmed !== (notes?.text ?? '')) {
            setLoading(true);
            try {
                if (notes) {
                    await updateNotes(notes.id, { text: trimmed });
                } else if (trimmed !== '') {
                    await addNotes({ text: trimmed, day });
                }
                onSuccess?.();
            } catch (error) {
                console.error("Error saving notes: ", error);
            } finally {
                setLoading(false);
            }
        }
        onClose();
    }

    return (
        <ModalDimmer visible={visible} onClose={handleClose} panelStyle={styles.panel}>
            <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                multiline
                placeholder="Écris une note..."
                placeholderTextColor="#3A020366"
                editable={!loading}
            />

            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
        </ModalDimmer>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: '#f8aebe',
        paddingVertical: 25,
        paddingHorizontal: 35,
    },
    textInput: {
        flex: 1,
        paddingTop: 20,
        fontFamily: "Fredoka-Medium",
        fontSize: 18,
        color: '#3A0203',
        textAlignVertical: 'top',
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

export default ModalNotes;
