# Cap Verd Dish

Welcome to Cap Verd Dish, a web application built with [Next.js](https://nextjs.org/) and powered by Fuseki.

## Overview

Cap Verd Dish is a project aimed at showcasing the rich culinary heritage of Cape Verde through an interactive web interface. This project leverages the power of Next.js for frontend development and Fuseki for managing RDF data.

## Getting Started

To get started with Cap Verd Dish, follow these simple steps:

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/cap-verd-dish.git
    ```

2. Navigate to the project directory:

    ```bash
    cd cap-verd-dish
    ```

3. Build the Docker image:

    ```bash
    docker build -t fuseki_next .
    ```
4. Run the Docker container:

    ```bash
    docker run -p 3030:3030 -p 3000:3000 fuseki_next
    ```
5. Open your web browser and navigate to the following URLs:

    - <http://localhost:3000>: Frontend interface for Cap Verd Dish.
    - <http://localhost:3030>: Fuseki web UI for managing RDF data.

## Fuseki Web UI Login

To access the Fuseki web UI, use the following credentials:

- **Username**: admin
- **Password**: [generated password displayed in the terminal during container startup]

## License

This project is licensed under the MIT License - see the LICENSE file for details.