FROM node:20.18.1-alpine
WORKDIR /app
COPY . ./
ENV NODE_ENV=production
VOLUME ["/root/.sg-agent"]
CMD ["node", "main.js"]
