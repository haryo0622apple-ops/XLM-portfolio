const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();

// Railwayのポート(8080等)を自動取得
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));

// Stellarネットワークへのプロキシ設定
app.use('/stellar', proxy('https://stellar-mainnet.publicnode.com', {
    proxyReqPathResolver: (req) => req.url
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
