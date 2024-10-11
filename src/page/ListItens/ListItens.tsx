import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useState } from "react";
import { database } from "../../dataBase";
import { ProductModel } from "../../dataBase/model/productModel";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { suparbaseConnetion } from "../../dataBase/service/supabase";
export function ListItens() {
    const DATE_DEFAULT = new Date("1970-01-01T00:00:00.000Z").getTime();
    const [dbItens, setDbItens] = useState<ProductModel[]>([]);
    const [isSendLoading, setIsSendLoading] = useState<boolean>(false);
    async function fetchData() {
        const productCollection = database.get<ProductModel>("product");
        const response = await productCollection.query().fetch();
        console.log("response", response);
        setDbItens(response);
    }

    async function handleaAddDB(item: ProductModel) {
        try {
            setIsSendLoading(true);
            const update = new Date();
            const newData = {
                keyDB: item.id,
                created_at: new Date(item.created_at),
                name_product: item.name_product,
                qtd: item.qtd,
                file_photo: item.file_photo,
                updated_at: update,
            };
            await suparbaseConnetion.from("syncDB").insert(newData);
            const Uniqueproduct = await database.get<ProductModel>("product").find(item.id);
            await Uniqueproduct.update(() => {
                Uniqueproduct.updated_at = new Date(update).getTime();
            });
            await fetchData();
        } catch (error) {
            console.log("handleaAddDB - error", error);
        } finally {
            setIsSendLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 16,
                gap: 32,
            }}
        >
            {dbItens.length > 0 &&
                dbItens.map((item) => (
                    <View style={styles.containerItem} key={item.id}>
                        <View style={styles.containerItemRow}>
                            <MaterialCommunityIcons name="database-check" size={24} color="green" />
                            {new Date(item.updated_at).getTime() == DATE_DEFAULT ? (
                                <Ionicons name="cloud-offline" size={24} color="orange" />
                            ) : (
                                <Ionicons name="cloud-done" size={24} color="green" />
                            )}
                        </View>
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
                        <TouchableOpacity
                            style={styles.containerNotificationBtn}
                            onPress={() => {
                                handleaAddDB(item);
                            }}
                        >
                            {isSendLoading ? (
                                <ActivityIndicator size={"large"} color={"blaock"} />
                            ) : (
                                <Text>Sincronizar</Text>
                            )}
                        </TouchableOpacity>
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
    containerItemRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    containerNotificationBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "orange",
        height: 40,
        borderRadius: 4,
    },
});
