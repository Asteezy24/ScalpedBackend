FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn

# Bundle app source
COPY . .
RUN yarn build

# Run yarn with production to eliminate dev dependencies
# since we just build the app.
RUN yarn install --production

CMD [ "yarn", "start" ]