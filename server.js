const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));

// ブラウザの代わりにStellarへデータを取りに行く中継口
app.use('/stellar', proxy('https://stellar-mainnet.publicnode.com', {
    proxyReqPathResolver: (req) => {
        return req.url;
    }
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
