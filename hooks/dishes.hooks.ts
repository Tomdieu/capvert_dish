import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


type Dish = {
    name: string;
    description: string;
    image: string;
    ingredients: string[];
};

type Dishes = {
    dishes: Dish[];
    addDishes: (dish: Dish) => void;
    setDishes: (dishes: Dish[]) => void;
};

export const useDishes = create(persist<Dishes>((set) => ({
    dishes: [],
    addDishes: (dish: Dish) =>
        set((state) => ({
            dishes: [...state.dishes, dish],
        })),
    setDishes: (dishes: Dish[]) =>
        set(() => ({
            dishes: dishes,
        })),
}), { name: "", storage: createJSONStorage(() => localStorage) }));
