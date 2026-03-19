const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));
app.use('/stellar', proxy('https://stellar-mainnet.publicnode.com'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
