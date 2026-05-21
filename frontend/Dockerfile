FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:latest

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "rm -rf /app/share/* && cp -r ./dist/* /app/share/ && echo 'Frontend updated successfully' && sleep infinity"]
