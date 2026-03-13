import express from 'express';
import path from 'path';

const app = express();
// Railwayが指定するポート番号を読み込む（重要！）
const PORT = process.env.PORT || 3000;

// publicフォルダのファイルを公開する
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
