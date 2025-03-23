FROM node:23
WORKDIR /usr/src/rantoinne-streaming-node
COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn back:build
RUN yarn front:build
EXPOSE 8000
CMD ["yarn", "start"]
