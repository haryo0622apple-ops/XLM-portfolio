import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// ビルド後の 'dist' から見た 'public' の位置を正確に指定
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
