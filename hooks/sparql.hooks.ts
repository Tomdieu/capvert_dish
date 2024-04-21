import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';


type Sparql = {
    endPoint:string;
    setEndPoint:(endPoint:string)=>void;
    query:string;
    setQuery:(query:string)=>void;
}

export const useSparql = create(persist<Sparql>((set) => ({
    endPoint:"http://localhost:3030/cap-vert-dish/query",
    setEndPoint:(endPoint:string)=>set({endPoint}),
    query:"",
    setQuery:(query:string)=>set({query})
}), { name: "sparql", storage: createJSONStorage(() => localStorage) }))