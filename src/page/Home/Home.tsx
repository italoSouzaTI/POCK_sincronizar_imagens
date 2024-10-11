import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    StatusBar,
    Image,
    Dimensions,
    Alert,
    ScrollView,
} from "react-native";
import { Input } from "../../components/Input/Input";
import { useModelViewHome } from "./useModelViewHome";

export function Home() {
    const {
        inputNameRef,
        inputQtdRef,
        dataLength,
        itemCurrent,
        setItemCurrent,
        navigate,
        handlePermissionCamera,
        handleSaveDB,
        schedulePushNotification,
    } = useModelViewHome();

    return (
        <>
            <StatusBar barStyle={"dark-content"} />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 16,
                    gap: 16,
                    backgroundColor: "#fff",
                }}
            >
                <Input ref={inputNameRef} label="Nome produto" placeholder="Ex: João Silva " />
                <Input ref={inputQtdRef} label="Quantidade de itens" keyboardType="number-pad" placeholder="0" />
                {itemCurrent.img?.length ? (
                    <Image
                        source={{ uri: itemCurrent.img }}
                        width={Dimensions.get("screen").width - 32}
                        height={200}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.containerCamera}>
                        <TouchableOpacity onPress={() => handlePermissionCamera()}>
                            <Text>Tira Foto da nota fiscal</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.containerDeleteBtn}
                    onPress={() => {
                        data = itemCurrent;
                        data.img = "";
                        setItemCurrent(data);
                    }}
                >
                    <Text style={styles.containerBtnText}>Deleta imagem</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.containerBtn} onPress={handleSaveDB}>
                    <Text style={styles.containerBtnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.containerList}
                    onPress={() => navigate("ListItens")}
                >
                    <Text style={styles.containerBtnText}>{`Ir para lista de itens salvos -> ${dataLength}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.containerNotificationBtn}
                    onPress={() => schedulePushNotification()}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        Disparar notificações
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    containerCamera: {
        borderWidth: 1,
        height: 50,
        borderColor: "rgb(210, 210, 210)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    containerBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        height: 40,
        borderRadius: 4,
    },
    containerDeleteBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        height: 40,
        borderRadius: 4,
    },
    containerNotificationBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "orange",
        height: 40,
        borderRadius: 4,
    },
    containerList: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
        height: 40,
        borderRadius: 4,
    },
    containerBtnText: {
        color: "white",
        fontWeight: "bold",
    },
});
