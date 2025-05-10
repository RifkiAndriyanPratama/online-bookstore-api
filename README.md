# Online Bookstore Backend – Submission

Backend project untuk Online Bookstore menggunakan:
- Node.js + Express
- Prisma ORM + PostgreSQL
- JWT Auth
- Docker

## Menjalankan dengan Docker
### 1. Clone project ini

### 2. Salin `.env.example` ke `.env`
```bash
cp .env.example .env
```

### 3. Jalankan dengan docker compose
```
docker-compose up --build
```

### 4. Akses API
```
http://localhost:3000
```

## API Utama yang Tersedia:
- POST /auth/register → Register Customer
- POST /auth/login → Login dan dapatkan JWT
- GET /books → List semua buku (auth)
- GET /books/:id → Detail buku + produk (auth)
- GET /cart → Lihat isi keranjang (auth)
- POST /cart/items → Tambah item ke keranjang (auth)
- POST /checkout → Checkout dan buat invoice (auth)
- GET /invoices → Lihat daftar invoice (auth)

## Seeder
- Customer
- Author
- Book
- BookProduct
- Cart & Items

## Notes
Gunakan tool seperti Postman atau Thunder Client untuk mencoba endpoint
Sertakan Authorization: Bearer <token> untuk akses yang butuh login
