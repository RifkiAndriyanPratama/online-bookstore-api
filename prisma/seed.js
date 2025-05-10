const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const author = await prisma.author.upsert({
    where: { name: "Andriyan" },
    update: {},
    create: { name: "Andriyan" },
  });

  const book1 = await prisma.book.upsert({
    where: { isbn: "91238938920183983" },
    update: {},
    create: {
      title: "Javascript",
      isbn: "91238938920183983",
      publication_year: 2010,
      genre: "Programming",
      author_id: author.id,
    },
  });

  const book2 = await prisma.book.upsert({
    where: { isbn: "9780132350000" },
    update: {},
    create: {
      title: "Learn Web Developer",
      isbn: "9780132350000",
      publication_year: 2021,
      genre: "Programming",
      author_id: author.id,
    },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { name: "Gudang Jakarta" },
    update: {},
    create: { name: "Gudang Jakarta" },
  });

  const product1 = await prisma.bookProduct.upsert({
    where: {
      id: "product1", // manual ID atau buat kombinasi unik sendiri kalau mau
    },
    update: {},
    create: {
      id: "product1",
      format: "Hardcover",
      price: 250000,
      stock: 10,
      book_id: book1.id,
      warehouse_id: warehouse.id,
    },
  });

  const product2 = await prisma.bookProduct.upsert({
    where: {
      id: "product2",
    },
    update: {},
    create: {
      id: "product2",
      format: "E-book",
      price: 50000,
      stock: 10,
      book_id: book2.id,
      warehouse_id: warehouse.id,
    },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);
  const customer = await prisma.customer.upsert({
    where: { email: "rifki@gmail.com" },
    update: {},
    create: {
      name: "Rifki",
      email: "rifki@gmail.com",
      password: hashedPassword,
      address: "Jalan jalan",
      phone: "08123456789",
    },
  });

  const cart = await prisma.cart.upsert({
    where: { customer_id: customer.id },
    update: {},
    create: {
      customer_id: customer.id,
    },
  });

  const existingItems = await prisma.cartItem.findMany({
    where: { cart_id: cart.id },
  });

  if (existingItems.length === 0) {
    await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        book_product_id: product1.id,
        quantity: 1,
      },
    });

    await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        book_product_id: product2.id,
        quantity: 1,
      },
    });
  }

  const existingInvoice = await prisma.invoice.findUnique({
    where: { cart_id: cart.id },
  });

  if (!existingInvoice) {
    const totalAmount = product1.price + product2.price;
    await prisma.invoice.create({
      data: {
        cart_id: cart.id,
        customer_id: customer.id,
        total_amount: totalAmount,
        status: "pending",
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeder sukses dijalankan!");
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error saat seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
