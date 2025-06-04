FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "node prisma/seed.js && npm run dev"]
