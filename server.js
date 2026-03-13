const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/balance/:address", async (req, res) => {

  const address = req.params.address;

  try {

    // Stellarウォレット取得
    const response = await fetch(
      `https://horizon.stellar.org/accounts/${address}`
    );

    const data = await response.json();

    const balance = data.balances.find(
      b => b.asset_type === "native"
    ).balance;

    // XLM価格取得（JPY）
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=jpy"
    );

    const priceData = await priceRes.json();

    const price = priceData.stellar.jpy;

    const jpyValue = balance * price;

    res.json({
      balance,
      price,
      jpyValue
    });

  } catch (error) {

    res.json({ error: "not found" });

  }

});

app.listen(PORT, () => {
  console.log("server running");
});
