import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDBStore } from "../../store/useDBStore";

export function ListItens() {
    const { dbItens } = useDBStore(({ dbItens }) => ({
        dbItens,
    }));
    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 16,
                gap: 32,
            }}
        >
            {dbItens.map((item, index) => (
                <View style={styles.containerItem} key={index}>
                    <Text>{item.nome}</Text>
                    <Text>{item.qtd}</Text>
                    {item.img?.length ? (
                        <Image
                            source={{ uri: item.img }}
                            width={Dimensions.get("screen").width - 32}
                            height={200}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={{ color: "red" }}>SEM IMAGEM</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: "#fff",
    },
    containerItem: {
        gap: 16,
        borderWidth: 1,
    },
});
