# Gunakan image Node.js resmi
FROM node:20-alpine

# Buat direktori kerja di dalam container
WORKDIR /backend

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code ke dalam container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Jalankan server
CMD ["npm", "run", "dev"]
