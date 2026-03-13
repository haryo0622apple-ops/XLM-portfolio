const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/balance/:address", async (req, res) => {

  const address = req.params.address;

  try {

    const accountRes = await fetch(
      `https://horizon.stellar.org/accounts/${address}`
    );

    const accountData = await accountRes.json();

    if (!accountData.balances) {
      return res.json({ error: "invalid address" });
    }

    const nativeBalance = accountData.balances.find(
      b => b.asset_type === "native"
    );

    const balance = nativeBalance ? Number(nativeBalance.balance) : 0;

    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=jpy"
    );

    const priceData = await priceRes.json();

    const price = priceData.stellar.jpy;

    const jpyValue = balance * price;

    res.json({
      balance: balance,
      jpyValue: jpyValue
    });

  } catch (error) {

    res.json({ error: "server error" });

  }

});


app.get("/transactions/:address", async (req, res) => {

  const address = req.params.address;

  try {

    const response = await fetch(
      `https://horizon.stellar.org/accounts/${address}/operations?limit=50`
    );

    const data = await response.json();

    if (!data._embedded) {
      return res.json([]);
    }

    const tx = data._embedded.records
      .filter(t => t.type === "payment")
      .map(t => {

        let type = "other";

        if (t.to === address) type = "receive";
        if (t.from === address) type = "send";

        return {
          amount: Number(t.amount),
          type: type,
          time: t.created_at
        };

      });

    res.json(tx);

  } catch (error) {

    res.json([]);

  }

});


app.listen(PORT, () => {
  console.log("server running");
});
