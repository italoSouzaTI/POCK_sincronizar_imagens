import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Image, Dimensions, Alert } from "react-native";
import { Input, InputRef } from "../../components/Input/Input";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useRef } from "react";
import { IItem, useItemStore } from "../../store/useItemStore";
import { useDBStore } from "../../store/useDBStore";

export function Home() {
    const inputNameRef = useRef<InputRef>(null);
    const inputQtdRef = useRef<InputRef>(null);
    const { navigate } = useNavigation();
    const [status, requestPermission] = useCameraPermissions();
    const { itemCurrent, setItemCurrent } = useItemStore(({ itemCurrent, setItemCurrent }) => ({
        itemCurrent,
        setItemCurrent,
    }));
    const { setDBItens, dbItens } = useDBStore(({ setDBItens, dbItens }) => ({
        setDBItens,
        dbItens,
    }));

    async function handlePermissionCamera() {
        try {
            if (status?.granted) {
                navigate("Camera");
            }
            await requestPermission();
        } catch (error) {}
    }
    function handleSaveDB() {
        if (inputNameRef.current?.getValueInput() == undefined) {
            Alert.alert("Preencha o campo nome");
            return;
        }
        if (inputQtdRef.current?.getValueInput() == undefined) {
            Alert.alert("Preencha o campo quantidade");
            return;
        }
        if (itemCurrent.img == undefined || itemCurrent.img.length == 0) {
            Alert.alert("Preencha o campo foto");
            return;
        }
        let newParams: IItem = {};
        newParams.nome = inputNameRef.current?.getValueInput();
        newParams.qtd = inputQtdRef.current?.getValueInput();
        newParams.img = itemCurrent.img;
        setDBItens([...dbItens, newParams]);
        // Limpando lista
        setItemCurrent({
            nome: "",
            qtd: 0,
            img: "",
        });
        inputNameRef.current?.setValueInput(undefined);
        inputQtdRef.current?.setValueInput(undefined);
    }
    useEffect(() => {
        if (itemCurrent.nome) {
            inputNameRef.current?.setValueInput(itemCurrent.nome);
        }
        if (itemCurrent.qtd) {
            inputQtdRef.current?.setValueInput(itemCurrent.qtd);
        }
    }, [itemCurrent]);

    return (
        <>
            <StatusBar barStyle={"dark-content"} />
            <View style={styles.container}>
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

                <TouchableOpacity activeOpacity={0.8} style={styles.containerBtn} onPress={handleSaveDB}>
                    <Text style={styles.containerBtnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.containerList}
                    onPress={() => navigate("ListItens")}
                >
                    <Text style={styles.containerBtnText}>{`Ir para lista de itens salvos -> ${dbItens.length}`}</Text>
                </TouchableOpacity>
            </View>
        </>
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
