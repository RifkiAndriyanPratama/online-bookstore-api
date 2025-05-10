const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", async (req, res) => {
  const customer = await prisma.customer.findMany();
  res.send(customer);
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    // cek apakah email sudah terdaftar
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        phone,
      },
    });

    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat registrasi" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Cari user berdasarkan email
    const user = await prisma.customer.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }
    // Cocokkan password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password salah" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      message: "Login berhasil",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
});

module.exports = router;
