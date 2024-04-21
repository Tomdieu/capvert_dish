import { getDishByName,getDishOfPerson } from "@/actions/query";
import { useDishes } from "./dishes.hooks"
import { useState } from "react";

export const useHandleSearch = () => {
    const {setDishes,dishes} = useDishes()
    const [loading,setLoading] = useState(true)
    
    const handleSearch = (query:string) => {
        setLoading(true)
        getDishByName(query).then(setDishes);
        setTimeout(()=>{

            setLoading(false)
        },2000)
    }

    const getDishEatenByPerson = (name:string) => {
        setLoading(true)
        getDishOfPerson(name).then(setDishes);
        setTimeout(()=>{

            setLoading(false)
        },2000)
    }

    return {loading,setLoading,handleSearch,dishes,getDishEatenByPerson}
}