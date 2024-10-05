import "react-native-url-polyfill";
import { createClient } from "@supabase/supabase-js";
export const suparbaseConnetion = createClient(
    process.env.EXPO_PUBLIC_SUPARBASE_URL,
    process.env.EXPO_PUBLIC_SUPARBASE_ANON_PUBLIC
);
