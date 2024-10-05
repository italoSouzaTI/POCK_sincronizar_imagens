import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera, Home, ListItens } from "../page";
import * as QuickActions from "expo-quick-actions";
import { useQuickActionCallback } from "expo-quick-actions/hooks";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
const Stack = createNativeStackNavigator();

export function Route() {
    const { navigate } = useNavigation();
    /*
    Quick Actions
    Tem que ser chamado na raiz das rotas
    */
    useQuickActionCallback((action) => {
        if (action.hasOwnProperty("params") && action.params?.href == "ListItens") {
            navigate("ListItens");
        }
    });

    useEffect(() => {
        QuickActions.setItems([
            {
                id: "1",
                title: "Espere! Não me apague!",
                subtitle: "Estamos aqui para ajudar",
                icon: Platform.OS === "ios" ? "symbol:person.crop.circle.badge.questionmark" : undefined,
            },
            {
                id: "2",
                title: "Lista de produtos",
                subtitle: "Visualizar produtos registrados",
                icon: Platform.OS === "ios" ? "symbol:person.crop.circle.badge.questionmark" : undefined,
                params: {
                    href: "ListItens",
                },
            },
        ]);
    }, []);
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="ListItens" component={ListItens} />
        </Stack.Navigator>
    );
}
