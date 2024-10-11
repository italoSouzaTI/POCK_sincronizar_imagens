import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { suparbaseConnetion } from "../../dataBase/service/supabase";
import { useEffect, useRef, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useItemStore } from "../../store/useItemStore";
import { InputRef } from "../../components";
import { database } from "../../dataBase";
import { ProductModel } from "../../dataBase/model/productModel";
import { Alert, AppState } from "react-native";

//Chamada tem quer escopo Global.
const BACKGROUND_FETCH_TASK = "Teste em background";

// Criando registro para rodar em segundo plano
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 1, // 1 minutes
        stopOnTerminate: false, // Android - Se os eventos de busca em segundo plano devem ser reiniciados quando o dispositivo terminar de inicializar.,
        startOnBoot: true, // Android - Se deseja parar de receber eventos de busca em segundo plano após o usuário encerrar o aplicativo.
    });
}
//cancelando registro de background
async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
export function useModelViewHome() {
    const inputNameRef = useRef<InputRef>(null);
    const inputQtdRef = useRef<InputRef>(null);
    const isfocused = useIsFocused();
    const { navigate } = useNavigation();
    const [status, requestPermission] = useCameraPermissions();
    const [dataLength, setDataLength] = useState<number>(0);
    const { itemCurrent, setItemCurrent } = useItemStore(({ itemCurrent, setItemCurrent }) => ({
        itemCurrent,
        setItemCurrent,
    }));

    /*
    verificando status do registro em segundo plano
*/
    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        // status = Danied = 1 |Restricted = 2 | Available = 3
        if (status == 3) {
            //Antes de realizar um registro defina a tarefa antes de chamar esse method
            const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
            console.log("isRegistered", isRegistered);
            if (isRegistered) {
                await unregisterBackgroundFetchAsync();
                await checkStatusAsync();
            } else {
                await registerBackgroundFetchAsync();
            }
        }
    };
    // Definindo tarefa a ser executada em 2 plano.
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        try {
            // schedulePushNotification();
            await syncDB();
            // Be sure to return the successful result type!
            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

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

    async function schedulePushNotification(qtdItens = 0 as number) {
        const title = qtdItens == 0 ? `⚠️ Atenção` : "Itens Pendentes";
        const body =
            qtdItens == 0 ? "Teste de notificação" : `Sincronizando ${qtdItens} produtos pendentes em segundo plano.`;
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
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

    async function fetchDataSuparbase() {
        try {
            const responseSuparbase = await suparbaseConnetion.from("syncDB").select("*");
            const productCollection = await database.get<ProductModel>("product");
            const response = await productCollection.query().fetch();
            const filterResponseDB = response.filter((item) => item._raw.updated_at == 0);
            console.log("filterResponseDB", filterResponseDB);
            console.log("responseSuparbase", responseSuparbase);
            if (filterResponseDB.length && responseSuparbase.data.length) {
                for (let i = 0; i < responseSuparbase.data.length; i++) {
                    for (let j = 0; j < filterResponseDB.length; j++) {
                        if (
                            responseSuparbase.data[i].keyDB == filterResponseDB[j]._raw.id &&
                            filterResponseDB[j]._raw.updated_at == 0
                        ) {
                            console.log("foi");
                            const uniqueProduct = await database.get("product").find(filterResponseDB[j]._raw.id);
                            console.log("uniqueProduct", uniqueProduct._raw);
                            await database.write(async () => {
                                await uniqueProduct.update(() => {
                                    uniqueProduct.updated_at = new Date(responseSuparbase.data[i].updated_at).getTime();
                                });
                            });
                        }
                    }
                }
            }
        } catch (error) {
        } finally {
        }
    }

    async function syncDB() {
        try {
            const DATE_DEFAULT = new Date("1970-01-01T00:00:00.000Z").getTime();
            const productCollection = await database.get<ProductModel>("product");
            const response = await productCollection.query().fetch();
            const productsSync = response.filter((item) => item._raw.updated_at === DATE_DEFAULT);

            console.log(`Produtos a sincronizar: ${productsSync.length}`);

            if (productsSync.length) {
                await schedulePushNotification(productsSync.length);
                const updatePromises = productsSync.map(async (product) => {
                    console.log("productsSync", product._raw);
                    const update = new Date();
                    const newData = {
                        keyDB: product._raw.id,
                        created_at: new Date(product._raw.created_at),
                        name_product: product._raw.name_product,
                        qtd: product._raw.qtd,
                        file_photo: product._raw.file_photo,
                        updated_at: update,
                    };
                    console.log(newData);

                    try {
                        const { status, error } = await suparbaseConnetion.from("syncDB").insert(newData);
                        if (status === 201) {
                            const Uniqueproduct = await database.get<ProductModel>("product").find(product._raw.id);

                            if (Uniqueproduct) {
                                console.log(Uniqueproduct._raw);
                                console.log("update.getTime()", update.getTime());
                                const responseUniqueproduct = await Uniqueproduct.update((draft) => {
                                    draft.updated_at = update.getTime();
                                });
                                console.log("responseUniqueproduct", responseUniqueproduct);
                            } else {
                                console.error(`Produto não encontrado: ${product._raw.id}`);
                            }
                        } else {
                            console.error("Erro na inserção:", error);
                        }
                    } catch (err) {
                        console.error("Erro durante a inserção:", err);
                    }
                });
                await Promise.all(updatePromises);
            }
        } catch (error) {
            console.error("syncDB - error:", error);
        }
    }
    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (nextAppState) => {
            if (nextAppState === "active") {
                await fetchDataSuparbase();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);
    useEffect(() => {
        if (itemCurrent.nome) {
            inputNameRef.current?.setValueInput(itemCurrent.nome);
        }
        if (itemCurrent.qtd) {
            inputQtdRef.current?.setValueInput(itemCurrent.qtd);
        }
        fetchData();
    }, [itemCurrent]);
    useEffect(() => {
        if (isfocused) {
            // console.log("suparbaseConnetion", suparbaseConnetion);
            checkStatusAsync();
        }
    }, [isfocused]);
    useEffect(() => {
        return () => subscription.remove(); // Limpa o listener
    }, []);
    return {
        inputNameRef,
        inputQtdRef,
        isfocused,
        status,
        dataLength,
        itemCurrent,
        setItemCurrent,
        navigate,
        handlePermissionCamera,
        schedulePushNotification,
        handleSaveDB,
    };
}
