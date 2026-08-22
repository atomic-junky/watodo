import { VerticalScallop } from "@/components/VerticalScallop";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function onBoarding() {
    return (
        <View style={styles.app}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                        Bienvenue sur Watodo👋
                    </Text>
                </View>
                <View style={styles.content}>
                    <VerticalScallop />

                    <Pressable style={styles.loginButton}>
                        <Text style={styles.buttonText}  numberOfLines={1} ellipsizeMode="tail">
                            Se connecter avec Google
                        </Text>
                    </Pressable>
                    <Text style={styles.subtitle}>
                        ou
                    </Text>
                    <Pressable style={styles.emptyButton}>
                        <Text style={[styles.buttonText, {color: '#FAF8FC'}]} numberOfLines={1} ellipsizeMode="tail">
                            Se connecter en tant qu'invité
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    app: {
        backgroundColor: '#FAF8FC',
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    header: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 25,
    },
    title: {
        fontSize: 20,
        fontFamily: "Fredoka-Bold",
        color: '#3A0203',
    },

    content: {
        width: '100%',
        height: '100%',
        backgroundColor: '#602244',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
        gap: 15,
    },
    loginButton: {
        width: '100%',
        height: 60,
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'center',
        backgroundColor: '#FAF8FC',
        borderRadius: 30,
        paddingHorizontal: 20,
    },
    emptyButton: {
        width: '100%',
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: "Fredoka-Bold",
        textAlign: 'center',
        color: '#602244',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "Fredoka-SemiBold",
        color: '#FAF8FC',
        opacity: 0.75,
    }
});
