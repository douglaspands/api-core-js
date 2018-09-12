FROM node:carbon-alpine
LABEL maintainer="@douglaspands"
LABEL version="2.7.1"
ENV NODE_ENV=production
COPY . /var/www
WORKDIR /var/www
RUN npm i
CMD npm run start-cluster