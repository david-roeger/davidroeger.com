FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY pnpm*.yaml ./

RUN npm i -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "node", "build" ]
