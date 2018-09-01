FROM node:8.11.4-slim
LABEL maintainer="@douglaspands"
LABEL version="2.2.4"
ENV NODE_ENV=production
COPY . /var/www
WORKDIR /var/www
RUN npm i
ENTRYPOINT npm start