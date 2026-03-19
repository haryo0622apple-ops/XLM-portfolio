const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. 静的ファイル（index.html）を公開
app.use(express.static(path.join(__dirname, '.')));

// 2. Stellarネットワークへの通信を中継（CORSエラー対策）
// これにより、ブラウザは自分のサーバーに聞くだけで良くなります
app.use('/stellar', proxy('https://stellar-mainnet.publicnode.com'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
