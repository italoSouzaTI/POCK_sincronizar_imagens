import "react-native-url-polyfill";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPARBASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPARBASE_ANON_PUBLIC;
export const suparbaseConnetion = createClient(supabaseUrl, supabaseAnonKey);
