FROM node:16.17.0 as builder
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev --legacy-peer-deps
COPY . ./

FROM node:16.17.0-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "main.js"]