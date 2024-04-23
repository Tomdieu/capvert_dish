"use client";

import Header from "@/components/header";
import { useEffect } from "react";
import { useHandleSearch } from "@/hooks/handleSearh";
import DishCard from "@/components/DishCard";

import SideBar from "@/components/SideBar";
import Footer from "@/components/footer"
import { useFilter } from "@/hooks/filter.hooks";
import { Loader } from "lucide-react";

export default function Page() {
  const { handleSearch, dishes,loading,error } = useHandleSearch();
  const {dishFilter,personFilter} = useFilter()
  useEffect(() => {
    if(!dishFilter && !personFilter){

      handleSearch("");
    }
  }, []);

  console.log(dishes);

  return (
    <main
      className={
        "flex flex-col flex-1 space-y-2 container mx-auto h-full"
      }
    >
      <Header />
      <div className="space-y-5">
        <div className="flex h-full w-full">
          <div className="h-full w-0 transition-all ease-out duration-300 md:w-4/12 lg:w-2/12 border-r hidden md:block">
            <SideBar/>
          </div>
          <div className="w-full md:w-8/12 lg:w-10/12 h-full px-3 transition-all ease-out duration-300">
            {error && <p className="text-sm text-red-300 font-bold text-left w-full line-clamp-3">{error}</p>}
            {loading && <div className="flex flex-1 h-full w-full items=-center justify-center">
            <Loader size={64} className="animate-spin "/>
            </div>}
            {!loading && !error && (
              <section className="grid grid-cols-1 space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {!dishFilter && !personFilter && "All Dishes"}
                  {dishFilter && !personFilter && dishFilter === "a_z" && " Dishes A-Z"}
                  {dishFilter && !personFilter && dishFilter === "z_a" && " Dishes Z-A"}
                  {personFilter && !dishFilter && ` Dishes eaten by ${personFilter}`}
                  {personFilter && dishFilter && ` Dishes eaten by ${personFilter} and ${dishFilter === "a_z" ? "A-Z" : "Z-A"}` }
                </h1>
                {/* <AddDishForm/> */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 space-x-3 gap-2">
                {dishes.map((dish, index) => (
                  <DishCard key={dish.name} index={index} dish={dish} />
                ))}
              </div>
            </section>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
