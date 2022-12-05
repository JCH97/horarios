FROM node:16.16-alpine3.15 as build-stage

WORKDIR /usr/src/ui

COPY package*.json ./


RUN yarn cache clean && yarn install

COPY . .

RUN npm run build

FROM nginx as production-stage

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /usr/src/ui/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]