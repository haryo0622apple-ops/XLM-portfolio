const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/balance/:address", async (req, res) => {

  const address = req.params.address;

  try {

    const response = await fetch(
      `https://horizon.stellar.org/accounts/${address}`
    );

    const data = await response.json();

    const balance = data.balances.find(
      b => b.asset_type === "native"
    ).balance;

    res.json({balance});

  } catch (error) {

    res.json({error:"not found"});

  }

});

app.listen(PORT, () => {
  console.log("server running");
});
