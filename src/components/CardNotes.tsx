import { StyleSheet, View } from 'react-native';
import { TickCard, TickCardProps } from './TickCard';

const CardNotes = ({ date, onPressed } : TickCardProps) => {
    return (
        <TickCard cardColor='#f8aebe' onPressed={onPressed}>
            <View>
                
            </View>
        </TickCard>
    );
}

const styles = StyleSheet.create({
})

export default CardNotes;
