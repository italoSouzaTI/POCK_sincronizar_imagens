import { NavigationContainer } from "@react-navigation/native";
import { Route } from "./src/route";
import "./ReactotronConfig";
import { initializeStorage } from "./src/dataBase/storage/storageService";
import { mmkvStorage } from "./src/dataBase/storage/mmkvStorage";
initializeStorage(mmkvStorage);
export default function App() {
    return (
        <NavigationContainer>
            <Route />
        </NavigationContainer>
    );
}
