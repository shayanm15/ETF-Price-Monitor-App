const express = require("express");
const cors = require("cors");
const config = require("./config");
const router = require("./routes/index");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ETF Backend Running");
});


app.use(`${config.app_route}`, router);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});