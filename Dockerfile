FROM node:alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci && npm run build

FROM flashspys/nginx-static
RUN apk update && apk upgrade
COPY --from=0 /usr/src/app/dist /static

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
