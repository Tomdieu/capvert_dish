import React from "react";
import { MotionDiv } from "./motion";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  dish: Dish;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const DishCard = ({ dish, index }: Props) => {
  return (
    <MotionDiv
      variants={variants}
      initial={"hidden"}
      animate={"visible"}
      transition={{
        delay: 0.05 * index,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className="bg-stale-50 dark:bg-slate-800 w-full lg:max-w-sm rounded-lg shadow-lg overflow-hidden cursor-pointer"
    >
      {dish.image && (
        <Image
          alt={dish.name}
          className="w-full h-48 object-cover"
          height="200"
          src={`${dish.image}?raw=true`}
          style={{
            aspectRatio: "300/200",
            objectFit: "cover",
          }}
          width="300"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{dish.name}</h3>
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          {dish.description}
        </p>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselPrevious />

          <CarouselContent className="">
            {dish.ingredients.map((ingredient,index) => (
              <CarouselItem
                key={index}
                title={ingredient}
                className="pl-1 mx-1 line-clamp-1 md:basis-1/2 lg:basis-1/3  select-none border rounded-md"
              >
                {ingredient}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </MotionDiv>
  );
};

export default DishCard;
