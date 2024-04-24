"use server";

import SparqlClient from "sparql-http-client";

const client = new SparqlClient({
  endpointUrl: "http://localhost:3030/cap-vert-dish/query",
});

const addIngredient = (
  foodRecord: Record<string, string[]>,
  foodName: string,
  ingredient: string
): void => {
  // split the ingredient in two pices seperated by '#'
  ingredient = ingredient.split("#")[1];
  if (foodRecord[foodName]) {
    foodRecord[foodName].push(ingredient);
  } else {
    foodRecord[foodName] = [ingredient];
  }
};

export const getDishByName = async (name: string) => {
  const dishes: Dish[] = [];

  const foodIngredient: FoodRecord = {};

  const query = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX cvd: <http://www.semanticweb.org/ivantom/ontologies/2024/3/cap-vert-dish#>

        SELECT ?dish ?name ?description ?image ?ingredient
        WHERE {
            ?dish a cvd:Dish .
            ?dish cvd:FoodName ?name .
            ?dish cvd:FoodDescription ?description .
            ?dish cvd:FoodImage ?image .
            ?dish cvd:hasIngredient ?ingredient . 
            FILTER(STRSTARTS(LCASE(STR(?name)), LCASE("${name}")))
        }
        ORDER BY ASC(?name) 
    `;

  const stream = client.query.select(query);
  await new Promise<void>((resolve, reject) => {
    stream.on("data", (row: DishQueryResult) => {
      const dishItem: Dish = {
        name: row.name.value,
        description: row.description.value,
        image: row.image.value,
        ingredients: [],
      };
      addIngredient(foodIngredient, row.name.value, row.ingredient.value);

      // check if it already exists
      const founded = dishes.find((dish) => dish.name == dishItem.name);

      if (!founded) {
        dishes.push(dishItem);
      } else {
        if (dishItem.image !== "" && founded.image === "") {
          founded.image = dishItem.image;
        }
      }
    });
    stream.on("end", () => resolve());
    stream.on("error", (error: any) => reject(error));
  });

  // Map ingredients to dishes
  dishes.forEach((dish) => {
    dish.ingredients = foodIngredient[dish.name];
  });

  return dishes;
};

export const getPersons = (): Promise<string[]> => {
  const query = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX cvd: <http://www.semanticweb.org/ivantom/ontologies/2024/3/cap-vert-dish#>

    SELECT  ?name
    WHERE {
    
        ?person a cvd:Person .
        ?person cvd:personName ?name
    }
    `;

  return new Promise<string[]>((resolve, reject) => {
    const persons: string[] = [];

    const stream = client.query.select(query);

    stream.on("error", (error: Error) => {
      reject(error);
    });

    stream.on("data", (row: PersonQueryResult) => {
      persons.push(row.name.value);
    });

    stream.on("end", () => {
      resolve(persons);
    });
  });
};

export const getClasses = (): Promise<ClassWithSubclasses> => {
  const query = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX cvd: <http://www.semanticweb.org/ivantom/ontologies/2024/3/cap-vert-dish#>

    SELECT DISTINCT ?class ?subclass
    WHERE {
      ?class a owl:Class .
      OPTIONAL {
        ?subclass rdfs:subClassOf ?class .
      }
    }
  `;

  return new Promise<ClassWithSubclasses>((resolve, reject) => {
    const classes: ClassWithSubclasses = {};

    const stream = client.query.select(query);

    stream.on('data', (data) => {
      let className = data.class.value;
      if (typeof className === 'string') {
        className = className.split('#')[1];
      }
      let subclass = data.subclass ? data.subclass.value : null;
      if (typeof subclass === 'string') {
        subclass = subclass.split('#')[1];
      }

      if (!classes[className]) {
        classes[className] = [];
      }

      if (subclass) {
        classes[className].push(subclass);
      }
    });

    stream.on('end', () => {
      resolve(classes);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};


export const getInstancesOfClass = (className: string) => {
  const query = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX cvd: <http://www.semanticweb.org/ivantom/ontologies/2024/3/cap-vert-dish#>
  
  SELECT DISTINCT ?instance
  WHERE {
    ?instance rdf:type cvd:${className} .
  }
  `;

  return new Promise<string[]>((resolve, reject) => {
    const instances: string[] = [];

    const stream = client.query.select(query); // Assuming 'client' is already defined

    stream.on('data', (data) => {
      instances.push(data.instance.value);
    });

    stream.on('end', () => {
      resolve(instances);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

export const getDishOfPerson = (personName: string) => {
  const query = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX cvd: <http://www.semanticweb.org/ivantom/ontologies/2024/3/cap-vert-dish#>

    SELECT ?personName ?name ?description ?image ?ingredient
    WHERE {
        ?person a cvd:Person ;
                cvd:personName ?personName .
        ?food a cvd:Dish ;
            cvd:FoodName ?name ;
            cvd:FoodDescription ?description ;
            cvd:FoodImage ?image ;
            cvd:hasIngredient ?ingredient .
        ?person cvd:eats ?food
    
        FILTER (CONTAINS(?personName, "${personName}"))
    }
    LIMIT 100
    `;

  return new Promise<Dish[]>((resolve, reject) => {
    const dishes: Dish[] = [];
    const foodIngredient: FoodRecord = {};

    const stream = client.query.select(query);

    stream.on("error", (error: Error) => {
      reject(error);
    });

    stream.on("data", (row: DishQueryResult) => {
      const dishItem: Dish = {
        name: row.name.value,
        description: row.description.value,
        image: row.image.value,
        ingredients: [],
      };
      addIngredient(foodIngredient, row.name.value, row.ingredient.value);

      // check if it already exists
      const founded = dishes.find((dish) => dish.name == dishItem.name);

      if (!founded) {
        dishes.push(dishItem);
      } else {
        if (dishItem.image !== "" && founded.image === "") {
          founded.image = dishItem.image;
        }
      }
    });

    stream.on("end", () => {
      dishes.forEach((dish) => {
        dish.ingredients = foodIngredient[dish.name];
      });

      resolve(dishes);
    });
  });
};


export const executeSparqlQuery = (endpoint: string, query: string) => {
  const client = new SparqlClient({
    endpointUrl: endpoint,
  });

  return new Promise<any>((resolve, reject) => {
    const result: any[] = [];
    const stream = client.query.select(query);

    stream.on("data", (row: any) => {
      result.push(row);
    });

    stream.on("end", () => {
      resolve(result);
    });

    stream.on("error", (error: any) => {
      reject(error);
    });
  });
}


