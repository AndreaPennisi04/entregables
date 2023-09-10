FROM node:18
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
ENV NODE_ENV produccion
CMD [ "node", "./src/index.js" ]
