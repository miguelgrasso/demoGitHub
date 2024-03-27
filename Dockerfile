FROM node:12.9.1-buster-slim

RUN npm install -g yarn

RUN mkdir -p /home/api/app
WORKDIR /home/api/app

COPY . .
RUN yarn install --no-optional

EXPOSE 3999

CMD exec yarn run start
