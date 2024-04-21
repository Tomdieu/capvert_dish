import {create} from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'


type FilterType = {
    dishFilter: string;
    personFilter: string;
    setDishFilter: (dishFilter: string) => void;
    setPersonFilter: (personFilter: string) => void;
    clearFilter:()=>void;
}

export const useFilter = create(persist<FilterType>((set) => ({
    dishFilter: "",
    personFilter: "",
    setDishFilter: (dishFilter: string) => set(() => ({dishFilter})),
    setPersonFilter: (personFilter: string) => set(() => ({personFilter})),
    clearFilter:()=>set((state)=>({dishFilter:"",personFilter:""}))
}),{name:"filter",storage:createJSONStorage(()=>localStorage)}))