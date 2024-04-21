# Use a base image for Jena Fuseki 
FROM stain/jena-fuseki as fuseki

# ENV ADMIN_PASSWORD=adminpw123

# Copy configuration files and ontology
# COPY config/config.ttl /jena-fuseki/run/
COPY ontology/cap_vert_dishes.owl /jena-fuseki/ontology

# Copy the ontology file to the dataset directory of Jena Fuseki
# COPY ./ontology/cap_vert_dishes.owl /jena-fuseki/run/databases/dataset/

# Expose port 3030 for Jena Fuseki
EXPOSE 3030

# Start Jena Fuseki server
CMD ["/jena-fuseki/fuseki-server","--file=/jena-fuseki/ontology/cap_vert_dishes.owl","/cap-vert-dish"]

# Use a base image with Node.js to build React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
COPY --from=fuseki /jena-fuseki/ontology /app/ontology
RUN npm ci
RUN npm install -g npm@latest
RUN npm i sharp

# Copy the rest of the application code
COPY . .

# Build React app
# This run will store the build in the folder build
RUN npm run build

# Use the built Jena Fuseki image
FROM fuseki AS runtime

# Use a base image with Node.js to run Next.js app
FROM node:18-alpine AS nextjs

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

COPY --from=build /app/build ./build

# Expose port 3000 for Next.js app
EXPOSE 3000

USER node

# Start Next.js app
CMD npm start
