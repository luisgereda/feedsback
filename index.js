const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const app_key = process.env.APP_KEY;
const secret = process.env.API_SECRET;
const app_id = process.env.APP_ID;
const stream = require("getstream");

const client = stream.connect(app_key, secret, app_id);

function onListen() {
  console.log(`Listening on :${port}`);
}

app.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const token = client.createUserToken(userId);
  res.send(token);
});

app.listen(port, onListen);
