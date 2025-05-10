const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const customerId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { customer_id: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart kosong atau tidak ditemukan" });
    }

    // total
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    // Cek apakah sudah pernah checkout
    const existingInvoice = await prisma.invoice.findUnique({
      where: { cart_id: cart.id },
    });

    if (existingInvoice) {
      return res.status(400).json({ message: "Cart ini sudah di-checkout" });
    }

    // Buat invoice baru
    const invoice = await prisma.invoice.create({
      data: {
        cart_id: cart.id,
        customer_id: customerId,
        total_amount: totalAmount,
        status: "pending",
      },
    });

    res.status(201).json({
      invoice_id: invoice.id,
      status: invoice.status,
      total_amount: invoice.total_amount,
      issued_at: invoice.issued_at,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
