declare type Dish = {
    name:string;
    description:string;
    image:string;
    ingredients:string[]
}

type FoodRecord = Record<string, string[]>;

declare type DishQueryResult = {
    dish: {
      value: string;
    };
    name: {
      value: string;
      language: string;
      datatype: {
        value: string;
      };
    };
    description: {
      value: string;
      language: string;
      datatype: {
        value: string;
      };
    };
    image: {
      value: string;
      language: string;
      datatype: {
        value: string;
      };
    };
    ingredient: {
      value: string;
    };
  };

  declare type PersonQueryResult = {
    name:{
      type:string;
      value:string
    }
  }


declare type DishCard = JSX.Element;

declare type SPARQLResult = {
  head: {
    vars: string[];
  };
  results: {
    bindings: Record<string, {
      type: string;
      value: string|number;
    }>[];
  };
};

type ClassWithSubclasses = {
  [className: string]: string[];
};


// declare type SPARQLResult = {
//   head: {
//     vars: string[];
//   };
//   results: {
//     bindings: {
//       [key: string]: {
//         type: string;
//         value: string;
//       };
//     }[];
//   };
// };
