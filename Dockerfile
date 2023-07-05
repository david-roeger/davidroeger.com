FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

ARG SUPABASE_HOST_ARG
ENV SUPABASE_HOST $SUPABASE_HOST_ARG

RUN npm ci --force
COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "node", "build" ]
