"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import { useSearch } from "@/hooks/search.hooks";
import { useHandleSearch } from "@/hooks/handleSearh";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {};

const Header = (props: Props) => {
  const { setQuery, query } = useSearch();
  const pathName = usePathname()
  const { handleSearch } = useHandleSearch();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="py-5 flex items-center justify-between border-b transition-all ease-in-out duration-100 delay-200 bg-background">
      <Link
        href={"/"}
        className="flex items-center cursor-pointer select-none hover:text-blue-500"
      >
        <Image src={"/logo.png"} width={64} height={64} alt="" />
        <h1 className="sm:text-sm md:text-base lg:text-xl font-bold hidden sm:block">Cap Verd Dishes</h1>
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="link">
          <Link  href={"/sparql"} className={cn(pathName === '/sparql' && "font-bold underline drop-shadow-lg ")}>SparQL</Link>
        </Button>
        <form
          onSubmit={onSubmit}
          method="get"
          action={"/query"}
          className="flex items-center gap-2 space-x-2"
        >
          <Label className="sr-only" htmlFor="search">
            Search
          </Label>
          <Input
            placeholder="Search"
            type="search"
            className="text-sm"
            id="search"
            name="query"
            value={query}
            required
            onChange={(e) => {
              handleSearch(e.target.value);
              setQuery(e.target.value);
            }}
          />
        </form>
        <ModeToggle />
      </div>
    </div>    
  );
};

export default Header;
