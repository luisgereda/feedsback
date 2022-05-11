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

app.post("/update", async (req, res) => {
  const { id, like } = req.body;
  const newLikes = parseInt(like) + 1;

  const updateActivity = await client.activityPartialUpdate({
    id: id,
    set: { likes: newLikes },
  });
  console.log(updateActivity);
  res.send(updateActivity);
});

app.delete("/deleteGlobal/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const global = client.feed("global", "all");

  const request = await global.removeActivity(id);
  console.log(request);

  res.send(request);
});

app.listen(port, onListen);
