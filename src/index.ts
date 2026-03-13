import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// publicフォルダの絶対パスを確実に指定する
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

// どんなURLにアクセスされても index.html を返す設定（404回避）
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
