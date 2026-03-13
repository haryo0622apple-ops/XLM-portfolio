const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

/* 残高 + 円換算 */

app.get("/balance/:address", async (req, res) => {

const address = req.params.address;

try{

const response = await fetch(
`https://horizon.stellar.org/accounts/${address}`
);

const data = await response.json();

const balance =
data.balances.find(b => b.asset_type === "native").balance;

const priceRes = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=jpy"
);

const priceData = await priceRes.json();

const price = priceData.stellar.jpy;

const jpyValue = balance * price;

res.json({
balance: balance,
price: price,
jpyValue: jpyValue
});

}catch{

res.json({error:"address not found"});

}

});


/* トランザクション取得 */

app.get("/transactions/:address", async (req,res)=>{

const address = req.params.address;

try{

const response = await fetch(
`https://horizon.stellar.org/accounts/${address}/operations?limit=100`
);

const data = await response.json();

const tx = data._embedded.records
.filter(t=>t.type==="payment")
.map(t=>{

let type="other"

if(t.to===address) type="receive"
if(t.from===address) type="send"

return{

amount:t.amount,
type:type,
time:t.created_at

}

})

res.json(tx)

}catch{

res.json({error:"failed"})

}

})


app.listen(PORT,()=>{
console.log("server running on "+PORT);
});
