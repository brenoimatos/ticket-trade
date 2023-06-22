# build environment
FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Atualizar o npm para a versão mais recente
RUN npm install -g npm

RUN npm install
COPY . /app

RUN npm run build

# production environment
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
