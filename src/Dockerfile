FROM node:carbon-alpine
LABEL description="Core de API REST/GRAPHQL em Node.js"
LABEL maintainer="@douglaspands"
LABEL version="2.9.0"
ENV NODE_ENV=production
COPY . /var/www
WORKDIR /var/www
RUN npm i
CMD npm run start-cluster