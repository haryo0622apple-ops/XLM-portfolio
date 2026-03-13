const express=require("express")
const fetch=require("node-fetch")

const app=express()

app.use(express.static("public"))

/* balance */

app.get("/balance/:address",async(req,res)=>{

const address=req.params.address

try{

const r=
await fetch(
`https://horizon.stellar.org/accounts/${address}`
)

const data=
await r.json()

const xlm=
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

/* transactions */

app.get("/transactions/:address",async(req,res)=>{

const address=req.params.address

try{

const r=
await fetch(
`https://horizon.stellar.org/accounts/${address}/payments?limit=20&order=desc`
)

const data=
await r.json()

const tx=data._embedded.records

const result=tx.map(t=>{

return{
type:t.type,
amount:t.amount,
time:t.created_at
}

})

res.json(result)

}catch{

res.json([])

}

})

const port=
process.env.PORT||3000

app.listen(port,()=>{

console.log("server started")

})
