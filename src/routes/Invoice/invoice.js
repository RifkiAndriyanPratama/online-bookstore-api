const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /invoices
router.get("/", async (req, res) => {
  try {
    const customerId = req.user.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        customer_id: customerId,
      },
      orderBy: {
        issued_at: "desc",
      },
      select: {
        id: true,
        cart_id: true,
        total_amount: true,
        status: true,
        issued_at: true,
      },
    });

    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
