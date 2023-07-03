FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

RUN npm ci --force
COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "node", "build" ]
