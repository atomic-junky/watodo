import { StyleSheet, Text, View } from 'react-native';
import { useNotes } from '../../store/notesStore';
import { TicketCard, TicketCardProps } from './TicketCard';

const CardNotes = ({ date, onPressed } : TicketCardProps) => {
    const notes = useNotes();

    return (
        <TicketCard cardColor='#f8aebe' onPressed={onPressed}>
            <View style={styles.cardContent}>
                <Text style={styles.noteText} numberOfLines={8} ellipsizeMode="tail">
                    {notes?.text}
                </Text>
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
        paddingHorizontal: 10,
    },
    noteText: {
        fontFamily: 'Fredoka-Medium',
        color: '#3A0203',
        fontSize: 14,
        lineHeight: 20,
    },
})

export default CardNotes;
