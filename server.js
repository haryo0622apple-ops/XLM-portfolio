app.get("/transactions/:address", async (req, res) => {

const address = req.params.address

try{

const response = await fetch(
`https://horizon.stellar.org/accounts/${address}/payments`
)

const data = await response.json()

const tx = data._embedded.records.map(t => {

let type = "other"

if(t.to === address) type = "receive"
if(t.from === address) type = "send"

return {

amount: t.amount,
asset: t.asset_type,
type: type,
time: t.created_at

}

})

res.json(tx)

}catch{

res.json({error:"failed"})

}

})
