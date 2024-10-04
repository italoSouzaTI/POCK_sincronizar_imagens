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
            {dbItens.map((item) => (
                <View style={styles.containerItem} key={item.id}>
                    <Text>{item.name_product}</Text>
                    <Text>{item.qtd}</Text>
                    {item.file_photo?.length ? (
                        <Image
                            source={{ uri: item.file_photo }}
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
