import { NavigationContainer } from "@react-navigation/native";
import { Route } from "./src/route";
import "./ReactotronConfig";
import { initializeStorage } from "./src/dataBase/storage/storageService";
import { mmkvStorage } from "./src/dataBase/storage/mmkvStorage";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
initializeStorage(mmkvStorage);
export default function App() {
    async function handlePermission() {
        try {
            const permisson = await Notifications.requestPermissionsAsync();
            if (!permisson.granted) {
                Notifications.requestPermissionsAsync();
                return;
            }
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });
        } catch (error) {}
    }
    useEffect(() => {
        handlePermission();
    }, []);
    return (
        <NavigationContainer>
            <Route />
        </NavigationContainer>
    );
}
