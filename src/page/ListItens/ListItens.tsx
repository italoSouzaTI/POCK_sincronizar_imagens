import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { database } from "../../dataBase";
import { ProductModel } from "../../dataBase/model/productModel";
export function ListItens() {
    const [dbItens, setDbItens] = useState<ProductModel[]>([]);
    async function fetchData() {
        const productCollection = database.get<ProductModel>("product");
        const response = await productCollection.query().fetch();
        setDbItens(response);
    }
    useEffect(() => {
        fetchData();
    }, []);

    console.log("dbItens", dbItens);
    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 16,
                gap: 32,
            }}
        >
            {dbItens.length &&
                dbItens.map((item) => (
                    <View style={styles.containerItem} key={item.id}>
                        <Text style={styles.title}>Nome do produto</Text>
                        <Text>{item.name_product}</Text>
                        <Text style={styles.title}>Quantidade itens selecionados</Text>
                        <Text>{item.qtd}</Text>
                        <Text style={styles.title}>Data</Text>
                        <Text>{`${new Date(item.created_at)}`}</Text>
                        {item.file_photo?.length ? (
                            <View
                                style={{
                                    padding: 4,
                                }}
                            >
                                <Text style={styles.title}>Foto do produto</Text>
                                <Image
                                    source={{ uri: item.file_photo }}
                                    width={Dimensions.get("screen").width - 42}
                                    height={200}
                                    resizeMode="cover"
                                />
                            </View>
                        ) : (
                            <Text style={{ color: "red" }}>SEM IMAGEM</Text>
                        )}
                        <View
                            style={{
                                width: "100%",
                                height: 2,
                                borderWidth: 1,
                                borderColor: "gray",
                            }}
                        />
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
        paddingHorizontal: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
