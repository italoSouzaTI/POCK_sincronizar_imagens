import { Alert, Text, TouchableOpacity } from "react-native";
import { CameraView } from "expo-camera";
import { useRef } from "react";
import { useItemStore } from "../../store/useItemStore";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
export function Camera() {
    const cameraRef = useRef<CameraView>(null);
    const { goBack } = useNavigation();
    const { setItemCurrent, itemCurrent } = useItemStore(({ setItemCurrent, itemCurrent }) => ({
        setItemCurrent,
        itemCurrent,
    }));
    async function handlePicture() {
        if (cameraRef.current) {
            const photoData = await cameraRef.current?.takePictureAsync();
            console.log("photoData", photoData);
            let data = itemCurrent;
            const newUriPhoto = await copyImageToPermanentStorage(photoData?.uri);
            data.img = newUriPhoto;
            setItemCurrent(data);
            goBack();
        }
    }
    const copyImageToPermanentStorage = async (cacheImagePath: string) => {
        //Dando nome a novo diretorio
        const permanentDirectory = FileSystem.documentDirectory + "imagensAPPDB/";

        // Cria o diretório se não existir
        await FileSystem.makeDirectoryAsync(permanentDirectory, { intermediates: true });

        const newFilePath = `${permanentDirectory}${new Date().getTime()}-boleto.jpg`; // Nome único para o novo arquivo

        try {
            await FileSystem.copyAsync({
                from: cacheImagePath,
                to: newFilePath,
            });
            console.log("Imagem copiada para:", newFilePath);
            return newFilePath; // Retorna o novo caminho da imagem
        } catch (error) {
            console.error("Erro ao copiar a imagem:", error);
            Alert.alert("Erro", "Não foi possível copiar a imagem.");
        }
    };

    return (
        <>
            <CameraView
                ref={cameraRef}
                style={{
                    flex: 1,
                }}
                facing="back"
            >
                <TouchableOpacity
                    style={{
                        height: 50,
                        width: 80,
                        backgroundColor: "blue",
                        bottom: 0,
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "40%",
                        marginRight: "40%",
                        marginBottom: 20,
                        borderRadius: 8,
                    }}
                    onPress={handlePicture}
                >
                    <Text
                        style={{
                            color: "white",
                        }}
                    >
                        CAPTURE
                    </Text>
                </TouchableOpacity>
            </CameraView>
        </>
    );
}
