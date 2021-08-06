// require express
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//require .env
/* require("dotenv").config(); */

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// ** MIDDLEWARE ** //
 
// require rutas
const router = require("./routes/accessibility");

// declaracion de express
const app = express();
const { sequelize } = require("./utils/database");

// uses para JSON
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", router); // rutas para API
// error 404 y 500
app.use((req, res, next) => {
  console.log("error404");
  return res.status(404).json({ message: "Route does not exist" });
});
app.use((err, req, res, next) => {
  console.log("error500");
  return res.status(500).json({ message: `Server ${err}` });
});

// Conexion a base de datos
// force: true => DROP TABLES
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT, () => {
      console.log(
        `Example app listening at http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => console.log("sequelize err", err));
