const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/book.routes");

// Usaremos express para los middleware
const app = express();
app.use(bodyParser.json()); // Parseador de bodies

// Acá conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;

app.use("/books", bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Inicializado en el puerto " + port);
});
