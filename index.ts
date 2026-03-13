import express from 'express';
import path from 'path';

const app = express();
// Railwayが割り当てるポート番号を最優先で使う設定
const PORT = process.env.PORT || 3000;

// publicフォルダの中身（画面）を公開する
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
