const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

const paintingsRoutes = require("./routes/paintings");
const artistsRoutes = require("./routes/artists");
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");

app.use(express.json());
app.use(express.static(path.join(__dirname, "imgs")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/imgs/:name", (req, res, next) => {
  let name = req.params.name;
  let pathImg = path.join(__dirname, "imgs", name);
  const file = fs.createReadStream(pathImg);
  res.setHeader("Content-Type", "image/jpeg");
  file.pipe(res);
});

app.get("/imgs/download/:name", (req, res) => {
  let name = req.params.name;
  let pathImg = path.join(__dirname, "imgs", name);
  const file = fs.createReadStream(pathImg);
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Disposition", `attachment; filename=${name}`);
  file.pipe(res);
});

app.use("/paintings", paintingsRoutes);
app.use("/artists", artistsRoutes);
app.use("/search", searchRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@artproject.duo1qzg.mongodb.net/`
  )
  .then(() => {
    app.listen(process.env.PORT || 3000, () => console.log("server running"));
  })
  .catch((err) => {
    throw err;
  });
