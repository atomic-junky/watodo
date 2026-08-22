import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function onBoarding() {
    return (
    <>
        <Stack.Screen options={{ title: 'Oops! Not Found' }} />
        <SafeAreaView>
        <View style={styles.container}>
            <Text style={styles.title}>
                Oops! La page que vous cherchez n'existe pas.
            </Text>
            <Link href="/">
                <Text style={styles.link}>Retour à l'accueil</Text>
            </Link>
        </View>
        </SafeAreaView>
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#602244',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontFamily: "Fredoka-SemiBold",
        color: '#FAF8FC',
        opacity: 0.75,
    },
    link: {
        fontSize: 20,
        fontFamily: "Fredoka-Bold",
        color: '#FAF8FC',
    }
});
