const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("."));

app.get("/balance/:address", async (req, res) => {
  const address = req.params.address;

  try {
    const response = await fetch(
      `https://horizon.stellar.org/accounts/${address}`
    );
    const data = await response.json();

    const balance = data.balances.find(
      (b) => b.asset_type === "native"
    ).balance;

    res.json({ balance });

  } catch (error) {
    res.json({ error: "address not found" });
  }
});

app.listen(3000, () => {
  console.log("server running");
});
