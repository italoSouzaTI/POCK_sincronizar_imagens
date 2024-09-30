import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera, Home, ListItens } from "../page";

const Stack = createNativeStackNavigator();

export function Route() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="ListItens" component={ListItens} />
        </Stack.Navigator>
    );
}
