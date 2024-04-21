import { getDishByName, getDishOfPerson } from "@/actions/query";
import { useDishes } from "./dishes.hooks";
import { useState } from "react";

export const useHandleSearch = () => {
    const { setDishes, dishes } = useDishes();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        setLoading(true);
        setError(null); // Resetting error state
        getDishByName(query)
            .then(setDishes)
            .catch((err) => {
                setError("Error fetching dishes: " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getDishEatenByPerson = (name: string) => {
        setLoading(true);
        setError(null); // Resetting error state
        getDishOfPerson(name)
            .then(setDishes)
            .catch((err) => {
                setError("Error fetching dishes eaten by person: " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { loading, setLoading, error, handleSearch, dishes, getDishEatenByPerson };
};
