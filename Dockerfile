# Use a base image with Node.js to build React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# COPY --from=fuseki /jena-fuseki/ontology /app/ontology
RUN npm ci
RUN npm install -g npm@latest
RUN npm i sharp

# Copy the rest of the application code
COPY . .

# Build React app
# This run will store the build in the folder build
RUN npm run build

# Use a base image for Jena Fuseki 
FROM stain/jena-fuseki

# ENV ADMIN_PASSWORD=adminpw123

# Copy configuration files and ontology
# COPY config/config.ttl /jena-fuseki/run/
COPY --from=build /app/ontology/cap_vert_dishes.owl /tmp/

# COPY . /jena-fuseki/webapp

COPY --from=build /app/ /jena-fuseki/webapp/build/

# Copy the ontology file to the dataset directory of Jena Fuseki
# COPY ./ontology/cap_vert_dishes.owl /jena-fuseki/run/databases/dataset/

# Expose port 3030 for Jena Fuseki and node
EXPOSE 3000
EXPOSE 3030

USER root

RUN apk upgrade --no-cache
RUN apk add --update curl

ENV NODE_PACKAGE_URL  https://unofficial-builds.nodejs.org/download/release/v18.17.0/node-v18.17.0-linux-x64-musl.tar.gz
RUN apk add libstdc++
RUN wget $NODE_PACKAGE_URL
RUN mkdir -p /opt/nodejs
RUN tar -zxvf *.tar.gz --directory /opt/nodejs --strip-components=1
RUN rm *.tar.gz
RUN ln -s /opt/nodejs/bin/node /usr/local/bin/node
RUN ln -s /opt/nodejs/bin/npm /usr/local/bin/npm

# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
#     && apk add nodejs
RUN apk add --no-cache nodejs npm
RUN npm install -g npm@9.6.6

RUN node -v

    # Copy startup script
COPY --from=build /app/startup.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/startup.sh && chown root:root /usr/local/bin/startup.sh
# RUN chmod +x /usr/local/bin/startup.sh

# Define default command
CMD ["startup.sh"]

# # Start Jena Fuseki server
# CMD /jena-fuseki/fuseki-server --file=/tmp/cap_vert_dishes.owl /cap-vert-dish && npm start --prefix fuseki/build/
