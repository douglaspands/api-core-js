FROM node:carbon-alpine
LABEL maintainer="@douglaspands"
LABEL version="2.6.1"
ENV NODE_ENV=production
COPY . /var/www
WORKDIR /var/www
RUN npm i
RUN npm i pm2 -g
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]