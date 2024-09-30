import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
import { IItem } from "./useItemStore";
import { APP_DB } from "../dataBase/storage/storageKey";
import { mmkvStorage } from "../dataBase/storage/mmkvStorage";

type State = {
    dbItens: IItem[];
};

type Actions = {
    setDBItens: (dbItens: IItem[]) => void;
    removeDBItens: () => void;
};

export const useDBStore = create<State & Actions>()(
    persist(
        (set) => ({
            dbItens: [],
            removeDBItens: () => {
                set({ dbItens: [] });
            },
            setDBItens: (state) => {
                set({ dbItens: state });
            },
        }),
        {
            name: APP_DB,
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);
