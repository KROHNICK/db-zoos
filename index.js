const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send("Server Works.");
});
// Server working properly on postman.

// endpoints here

server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (err) {
    res.status(500).json({
      error: "Some useful error message"
    });
  }
});

server.post("/api/zoos", async (req, res) => {
  try {
    const [id] = await db("zoos").insert(req.body);
    const zoo = await db("zoos")
      .where({ id })
      .first();
    res.status(201).json(zoo);
  } catch (err) {
    res.status(500).json({
      error: "Could not create new zoo."
    });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
