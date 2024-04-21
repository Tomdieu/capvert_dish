# Use a base image with Node.js to build React app
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build React app
RUN npm run build

# Use a base image for Jena Fuseki
FROM openjdk:8-jre-slim

# Set working directory
WORKDIR /fuseki

# Download and extract Jena Fuseki (replace <version> with the actual version)
RUN wget https://downloads.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.tar.gz && \
    tar -xzvf apache-jena-fuseki-4.8.0.tar.gz && \
    rm apache-jena-fuseki-4.8.0.tar.gz

# Copy the built React app from the builder stage
COPY --from=builder /app/build /fuseki/webapp

# Copy your .owl file into the dataset directory
COPY your_ontology.owl /fuseki/apache-jena-fuseki-4.8.0/run/databases/dataset/

# Expose ports for Jena Fuseki (default is 3030) and your React app (if needed)
EXPOSE 3030

# Define entry point to start Jena Fuseki
CMD ["/fuseki/apache-jena-fuseki-4.8.0/fuseki-server"]
