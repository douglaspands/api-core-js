FROM node:latest
MAINTAINER douglaspands
ENV PORT=3000
ENV NODE_ENV=production
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm start
EXPOSE $PORT