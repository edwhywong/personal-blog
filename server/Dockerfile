FROM node:14

# Create app directory
WORKDIR /usr/src/app

# for caching reason
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .
COPY .env.production .env

ENV NODE_ENV production

RUN yarn build

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
