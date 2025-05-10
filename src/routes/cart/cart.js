const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const customerId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: {
        customer_id: customerId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                book: {
                  select: { title: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const response = {
      id: cart.id,
      customer_id: cart.customer_id,
      created_at: cart.createdAt,
      items: cart.items.map((item) => ({
        id: item.id,
        book_product_id: item.book_product_id,
        quantity: item.quantity,
        created_at: item.created_at,
        product: {
          book: {
            title: item.product.book.title,
          },
          format: item.product.format,
          price: item.product.price,
        },
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const customerId = req.user.id;
    const { book_product_id, quantity } = req.body;

    // cek cart user
    let cart = await prisma.cart.findUnique({
      where: { customer_id: customerId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customer_id: customerId },
      });
    }

    // cek apakah produk ini sudah ada di cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        book_product_id,
      },
    });

    let item;

    if (existingItem) {
      // Jika ada update quantity
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Jika belum buat baru
      item = await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          book_product_id,
          quantity,
        },
      });
    }

    res.status(201).json({
      id: item.id,
      cart_id: item.cart_id,
      book_product_id: item.book_product_id,
      quantity: item.quantity,
      created_at: item.created_at,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
