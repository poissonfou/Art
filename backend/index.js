const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const paintingsRoutes = require("./routes/paintings");
const artistsRoutes = require("./routes/artists");
const searchRoutes = require("./routes/search");
const loginRoutes = require("./routes/login");

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

app.get("/imgs/:name", (req, res, next) => {
  let name = req.params.name;
  res.sendFile(path.join(__dirname, "imgs", name));
});

app.get("/imgs/download/:name", (req, res) => {
  let name = req.params.name;
  let path_ = path.join(__dirname, "imgs", name);
  res.setHeader("Content-Disposition", `attachment; filename=${name}`);
  res.download(path_, name);
});

app.use("/paintings", paintingsRoutes);
app.use("/artists", artistsRoutes);
app.use("/search", searchRoutes);
app.use("/user", loginRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect("mongodb+srv://emerson:lima1234@artproject.duo1qzg.mongodb.net/")
  .then(() => {
    app.listen(3000, () => console.log("server running"));
  })
  .catch((err) => console.log(err));
