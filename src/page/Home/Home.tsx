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
import { Input, InputRef } from "../../components/Input/Input";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { IItem, useItemStore } from "../../store/useItemStore";
import { database } from "../../dataBase";
import { ProductModel } from "../../dataBase/model/productModel";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

//Chamada tem quer escopo Global.
const BACKGROUND_FETCH_TASK = "Teste em background";

// Criando registro para rodar em segundo plano
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 1, // 1 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}
//cancelando registro de background
async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export function Home() {
    const inputNameRef = useRef<InputRef>(null);
    const inputQtdRef = useRef<InputRef>(null);
    const { navigate } = useNavigation();
    const [status, requestPermission] = useCameraPermissions();
    const [dataLength, setDataLength] = useState();
    const { itemCurrent, setItemCurrent } = useItemStore(({ itemCurrent, setItemCurrent }) => ({
        itemCurrent,
        setItemCurrent,
    }));

    async function handlePermissionCamera() {
        try {
            if (status?.granted) {
                navigate("Camera");
            }
            await requestPermission();
        } catch (error) {}
    }

    async function fetchData() {
        const productCollection = await database.get<ProductModel>("product");
        const response = await productCollection.query().fetch();
        console.log("fetchData", response.length);
        setDataLength(response.length);
    }

    async function handleSaveDB() {
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
        try {
            await database.write(async () => {
                await database.get<ProductModel>("product").create((data) => {
                    (data.name_product = inputNameRef.current?.getValueInput()),
                        (data.qtd = Number(inputQtdRef.current?.getValueInput())),
                        (data.file_photo = itemCurrent.img),
                        (data.created_at = new Date().getTime());
                });
            });
            Alert.alert("Sucesso", "Registro criado com sucesso");
            // // Limpando lista
            await fetchData();
            setItemCurrent({
                nome: "",
                qtd: 0,
                img: "",
            });
            inputNameRef.current?.setValueInput(undefined);
            inputQtdRef.current?.setValueInput(undefined);
        } catch (error) {}
    }

    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        try {
            await fetchData();
            // Be sure to return the successful result type!
            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        // status = Danied = 1 |Restricted = 2 | Available = 3
        console.log("checkStatusAsync - staus", status);
        if (status == 3) {
            const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
            console.log("isRegistered", isRegistered);
            if (isRegistered) {
                await unregisterBackgroundFetchAsync();
            } else {
                await registerBackgroundFetchAsync();
            }
        }
    };

    useEffect(() => {
        if (itemCurrent.nome) {
            inputNameRef.current?.setValueInput(itemCurrent.nome);
        }
        if (itemCurrent.qtd) {
            inputQtdRef.current?.setValueInput(itemCurrent.qtd);
        }
        fetchData();
        checkStatusAsync();
    }, [itemCurrent]);

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: `⚠️ Atenção`,
                body: "Você possui itens pendentes a serem sincronizados.",
                data: { action: "ListItens" },
            },

            trigger: null,
        });
    }
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response", response);
        const { actionIdentifier, notification } = response;

        // Verifica se a notificação tem o dado que você definiu
        if (notification.request.content.data.action === "ListItens") {
            // Navega para a tela desejada
            navigate("ListItens");
        }
    });
    useEffect(() => {
        return () => subscription.remove(); // Limpa o listener
    }, []);

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
                    onPress={schedulePushNotification}
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
