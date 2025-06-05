FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Jalankan migrasi
RUN npx prisma migrate deploy && node prisma/seed.js

# Expose port
EXPOSE 3000

# Jalankan server
CMD ["node", "src/index.js"]
