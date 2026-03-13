const express = require("express")
const fetch = require("node-fetch")

const app = express()

app.use(express.static("public"))

/* XLM価格 */

app.get("/price", async (req,res)=>{

try{

const r = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=jpy"
)

const data = await r.json()

res.json({
price:data.stellar.jpy
})

}catch{

res.json({price:0})

}

})

/* XLM残高 */

app.get("/balance/:address", async (req,res)=>{

const address = req.params.address

try{

const r =
await fetch(`https://horizon.stellar.org/accounts/${address}`)

const data = await r.json()

const xlm =
data.balances.find(b=>b.asset_type==="native")

res.json({
balance:xlm.balance
})

}catch{

res.json({
error:"Address not found"
})

}

})

/* トークン残高 */

app.get("/tokens/:address", async (req,res)=>{

const address=req.params.address

try{

const r=
await fetch(`https://horizon.stellar.org/accounts/${address}`)

const data=await r.json()

const tokens=data.balances.map(b=>{

let asset="XLM"

if(b.asset_code){
asset=b.asset_code
}

return{
asset:asset,
balance:b.balance
}

})

res.json(tokens)

}catch{

res.json([])

}

})

/* transactions */

app.get("/transactions/:address", async (req,res)=>{

const address=req.params.address

try{

const r=
await fetch(`https://horizon.stellar.org/accounts/${address}/payments?limit=20&order=desc`)

const data=await r.json()

const tx=data._embedded.records

const result=tx.map(t=>{

let asset="XLM"

if(t.asset_code){
asset=t.asset_code
}

let type=t.type

if(type==="path_payment_strict_send"||type==="path_payment_strict_receive"){
type="SWAP"
}

if(type==="payment"){

if(t.from===address){
type="SEND"
}else{
type="RECEIVE"
}

}

return{
type:type,
amount:t.amount,
asset:asset,
time:t.created_at
}

})

res.json(result)

}catch{

res.json([])

}

})

const port=process.env.PORT||3000

app.listen(port,()=>{

console.log("server started")

})
