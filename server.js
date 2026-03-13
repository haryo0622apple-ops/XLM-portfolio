const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/balance/:address", async (req, res) => {

const address = req.params.address;

try{

const response = await fetch(
`https://horizon.stellar.org/accounts/${address}`
);

if(!response.ok){
return res.json({error:"address not found"})
}

const data = await response.json();

const native =
data.balances.find(b=>b.asset_type==="native")

if(!native){
return res.json({error:"no balance"})
}

const balance = Number(native.balance)

const priceRes = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=jpy"
)

const priceData = await priceRes.json()

const price = priceData.stellar.jpy

const jpyValue = balance * price

res.json({
balance,
price,
jpyValue
})

}catch(err){

res.json({error:"server error"})

}

})

app.listen(PORT,()=>{
console.log("server running")
})
