FROM node:16.17.0
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev --legacy-peer-deps
COPY . ./
CMD ["node", "main.js"]