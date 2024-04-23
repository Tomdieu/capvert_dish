"use client"

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDishOfPerson, getPersons } from "@/actions/query";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useDishes } from "@/hooks/dishes.hooks";
import { useHandleSearch } from "@/hooks/handleSearh";
import { useFilter } from "@/hooks/filter.hooks";

const SideBar = () => {
  const [persons, setPersons] = useState<string[]>();

  const {
    dishFilter,
    setDishFilter,
    personFilter,
    setPersonFilter,
    clearFilter,
  } = useFilter();

  const [isFiltered, setIsFiltered] = useState(false);

  const { getDishEatenByPerson, handleSearch, setLoading } = useHandleSearch();

  const { dishes, setDishes } = useDishes();

  const handleClear = () => {
    clearFilter();
    handleSearch("");
  };

  useEffect(() => {
    getPersons().then(setPersons);
  }, []);

  useEffect(() => {
    if (dishFilter || personFilter) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [dishFilter, personFilter]);

  useEffect(() => {
    if (dishFilter === "") {
      if (personFilter) {
        getDishEatenByPerson(personFilter);
      }
    }
  }, [personFilter, dishFilter]);



  useEffect(() => {
    // Sort dishes when dishFilter changes
    if (dishes && (dishFilter === "a_z" || dishFilter === "z_a")) {
      const sortedDishes = [...dishes].sort((a, b) => {
        if (dishFilter === "a_z") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      if (JSON.stringify(sortedDishes) !== JSON.stringify(dishes)) {
        // Only update dishes if they have changed to prevent infinite loop
        setDishes(sortedDishes);
      }
    }
  }, [dishFilter, dishes]); // Add dishes to dependencies array
  
  useEffect(() => {
    // Fetch dishes of the selected person when both filters are set
    if (personFilter !== "" && dishFilter !== "") {
      setLoading(true);
      getDishOfPerson(personFilter).then((fetchedDishes) => {
        // Sort fetched dishes if necessary
        const sortedFetchedDishes = dishFilter === "a_z"
          ? fetchedDishes.sort((a, b) => a.name.localeCompare(b.name))
          : fetchedDishes.sort((a, b) => b.name.localeCompare(a.name));
        setDishes(sortedFetchedDishes);
        setLoading(false);
      }).catch((error) => {
        // Handle error if necessary
        console.error("Error fetching dishes:", error);
        setLoading(false);
      });
    }
  }, [personFilter, dishFilter]); // Correct dependencies
  

  return (
    <div className="flex space-y-4 flex-col px-1 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Filter</h1>
        {isFiltered && (
          <Button onClick={handleClear} variant={"ghost"} size={"icon"}>
            <X />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 space-y-2 w-full">
        <Label className="font-bold">Dish</Label>
        <RadioGroup
          value={dishFilter}
          onValueChange={(value) => setDishFilter(value)}
          defaultValue="comfortable"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="a_z" id="a_z" />
            <Label htmlFor="a_z" className="w-full">
              A-Z
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="z_a" id="z_a" />
            <Label htmlFor="z_a" className="w-full">
              Z-A
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-1 space-y-2">
        <Label className="font-bold">Person</Label>
        <Select value={personFilter} onValueChange={setPersonFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="------" />
          </SelectTrigger>
          <SelectContent>
            {persons?.map((person) => (
              <SelectItem value={person}>{person}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SideBar;
