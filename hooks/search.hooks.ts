import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

type Search = {
    query: string,
    setQuery: (value: string) => void;
};


export const useSearch = create(persist<Search>((set) => ({
    query: "",
    setQuery: (value: string) => set({ query: value })
}), { name: "search", storage: createJSONStorage(() => localStorage) }))