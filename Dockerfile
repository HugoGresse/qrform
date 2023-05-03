FROM node:alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci && npm run build

FROM flashspys/nginx-static
RUN apk update && apk upgrade
COPY --from=0 /usr/src/app/dist /static
COPY --from=0 /usr/src/app/landing/ /static/landing
# COPY --from=0 /usr/src/app/landing/indexLanding.html /static/indexLanding.html

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
