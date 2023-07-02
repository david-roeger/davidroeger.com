FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# force as long as tanstack/svelte-query@4.29.19 doesn't support svelte 4
RUN npm ci --force
COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "node", "build" ]
