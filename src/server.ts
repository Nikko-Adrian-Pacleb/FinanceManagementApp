import express from "express";

const port = 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("Server Initialization");
});

app.listen(5000, () => {
  console.log(`Server running at http://localhost:${port}`);
});
