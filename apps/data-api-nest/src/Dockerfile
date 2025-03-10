FROM node:20.18.1 as builder
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev
COPY . ./

FROM node:20.18.1-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "main.js"]