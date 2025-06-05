const express = require("express");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

const authMidleware = require("./middleware/authMiddleware");

const book = require("./routes/book/book");
const cart = require("./routes/cart/cart");
const customer = require("./routes/Customer/customer");
const checkout = require("./routes/Checkout/checkout");
const invoice = require("./routes/Invoice/invoice");

app.get("/", (req, res) => {
  res.send("successfull");
});

app.use("/auth", customer);
app.use("/books", authMidleware, book);
app.use("/cart", authMidleware, cart);
app.use("/checkout", authMidleware, checkout);
app.use("/invoices", authMidleware, invoice);

app.listen(port, () => {
  console.log(`Server running in port: ${port}`);
});
