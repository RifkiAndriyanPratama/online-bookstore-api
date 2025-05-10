const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const author = await prisma.author.create({
    data: {
      name: "Andriyan",
    },
  });

  const book = await prisma.book.createMany({
    data: [
      {
        title: "Javascript",
        isbn: "91238938920183983",
        publication_year: 2010,
        genre: "Programming",
        author_id: author.id,
      },
      {
        title: "Learn Web Developer",
        isbn: "9780132350000",
        publication_year: 2021,
        genre: "Programming",
        author_id: author.id,
      },
    ],
  });

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Gudang Jakarta",
    },
  });

  const product = await prisma.bookProduct.create({
    data: {
      format: "Hardcover",
      price: 250000,
      stock: 10,
      book_id: book.id,
      warehouse_id: warehouse.id,
    },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);
  const customer = await prisma.customer.create({
    data: {
      name: "Rifki",
      email: "rifki@gmail.com",
      password: hashedPassword,
      address: "Jalan jalan",
      phone: "08123456789",
    },
  });

  const cart = await prisma.cart.create({
    data: {
      customer_id: customer.id,
    },
  });

  await prisma.cartItem.create({
    data: {
      cart_id: cart.id,
      book_product_id: product.id,
      quantity: 1,
    },
  });

  await prisma.invoice.create({
    data: {
      cart_id: cart.id,
      customer_id: customer.id,
      total_amount: product.price,
      status: "pending",
    },
  });
}

main()
  .then(() => {
    console.log("seeder sukses dijalankan!");
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
