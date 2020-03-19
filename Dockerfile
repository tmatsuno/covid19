FROM node:alpine

WORKDIR /usr/src/app
COPY . .
RUN yarn

EXPOSE 3000
ENV HOST 0.0.0.0

CMD ["yarn", "start"]
