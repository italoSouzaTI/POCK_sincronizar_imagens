import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TextInput, TextInputProps, View, StyleSheet } from "react-native";

interface InputProps extends TextInputProps {
    label: string;
}
export type InputRef = {
    getValueInput: () => string | number | undefined;
    setValueInput: (value: string | number) => void;
};
export const Input = forwardRef<InputRef, InputProps>(({ label, ...restInput }, ref) => {
    const [valueText, setValue] = useState<any>();
    useImperativeHandle(ref, () => ({
        getValueInput: () => {
            return valueText; // Retorna o valor do estado
        },
        setValueInput: (ctx) => {
            setValue(ctx);
        },
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{label}</Text>
            <View style={styles.containerInput}>
                <TextInput value={valueText} onChangeText={(e) => setValue(e)} {...restInput} ref={ref} />
            </View>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
    },
    containerInput: {
        height: 45,
        borderWidth: 1,
        borderColor: "rgb(210, 210, 210)",
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: "center",
    },
});
