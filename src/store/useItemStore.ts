import { create } from "zustand";
export interface IItem {
    nome: string;
    qtd: number;
    img?: string;
}
export const INITIAL_ITEM = {
    nome: "",
    qtd: 0,
    img: "",
};
type State = {
    itemCurrent: IItem;
};
type Actions = {
    setItemCurrent: (token: IItem) => void;
};
export const useItemStore = create<State & Actions>()((set) => ({
    itemCurrent: INITIAL_ITEM,
    setItemCurrent: (value: IItem) => {
        set({ itemCurrent: value });
    },
}));
