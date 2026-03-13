// ローカルストレージからアドレスを読み込む
const savedAddress = localStorage.getItem('stellar_address');

// 保存する関数
function saveAddress(address: string) {
  localStorage.setItem('stellar_address', address);
  alert('アドレスを保存しました！');
  location.reload(); // 再読み込みして残高表示を更新
}
