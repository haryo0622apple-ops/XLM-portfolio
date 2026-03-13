const express = require("express")
const fetch = require("node-fetch")

const app = express()

app.use(express.static("public"))

/* Balance */

app.get("/balance/:address", async (req, res) => {

const address = req.params.address

try{

const r =
await fetch(`https://horizon.stellar.org/accounts/${address}`)

const data =
await r.json()

const xlm =
data.balances.find(b => b.asset_type === "native")

res.json({
balance: xlm.balance
})

}catch{

res.json({
error: "Address not found"
})

}

})

/* Transactions */

app.get("/transactions/:address", async (req, res) => {

const address = req.params.address

try{

const r =
await fetch(`https://horizon.stellar.org/accounts/${address}/payments?limit=20&order=desc`)

const data =
await r.json()

const tx =
data._embedded.records

const result =
tx.map(t => {

let asset = "XLM"

if(t.asset_code){
asset = t.asset_code
}

/* type変換 */

let type = t.type

if(type === "path_payment_strict_send"){
type = "SWAP"
}

if(type === "path_payment_strict_receive"){
type = "SWAP"
}

if(type === "payment"){

if(t.from === address){
type = "SEND"
}else{
type = "RECEIVE"
}

}

return{
type: type,
amount: t.amount,
asset: asset,
time: t.created_at
}

})

res.json(result)

}catch{

res.json([])

}

})

const port =
process.env.PORT || 3000

app.listen(port, () => {

console.log("Server started")

})
