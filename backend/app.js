const express = require("express");
const path = require("path");
const restRoutes = require("./routes/restRoutes");
const apiRoutes = require("./routes/apiRoutes");
const port = 3000;

const app = express();
const server = app.listen(port, (err) => {
  if (err) {
    console.log(`Server can not listen to ${port}.`);
    return;
  }
  console.log(`Listening to port ${port}.`);
});

app.use("/rest", restRoutes);
app.use("/api", apiRoutes);

app.use(express.json()); // Lets us acces the req.body object.

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
