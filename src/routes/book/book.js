const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// semua buku
router.get("/", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },
    });
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// buku + detail
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        products: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error("Error fetching book by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
