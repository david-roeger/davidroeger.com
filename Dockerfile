FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

# ENV PC_AUTH=""
# ENV STROMEE_INVOICE_API_KEY=""
# ENV STROMEE_INVOICE_URL=""
# ENV AUTH=""

# ENV SPOTIFY_CLIENT_ID=""
# ENV SPOTIFY_CLIENT_SECRET=""
# ENV SPOTIFY_REFRESH_TOKEN=""

# ENV PUBLIC_SUPABASE_URL=""
# ENV PUBLIC_SUPABASE_ANON_KEY=""

# ENV MAIL_SECRET=""
# ENV MAIL_PASSWORD=""
# ENV MAIL_SERVER=""
# ENV MAIL_ME=""
# ENV MAIL_NO_REPLY=""

RUN npm ci --omit dev
COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "node", "build" ]
