let webSocket; // WebSocketを格納する変数
document.getElementById('uuid').value = Date.now();

// 参加ボタンが押されたときにWebSocketを開始
function startWebSocket() {
    webSocket = new WebSocket('ws://localhost:8765');

    // WebSocketの接続が開いたときの処理
    webSocket.onopen = () => console.log('WebSocketが開かれました。');
    // メッセージを受信したときの処理
    webSocket.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data[0] === document.getElementById('uuid').value){
            displayMessages(data[1], data[2]);
        }
    };
    // WebSocketの接続が閉じたときの処理
    webSocket.onclose = () => console.log('WebSocketが閉じられました。');
}

// メッセージを表示する関数
function displayMessages(id, message) {
    // divタグの作成
    const div = document.createElement('div');
    // divタグにchat-messageを追加
    div.classList.add('chat-message');
    //ユーザー名の要素を作成し追加
    const usernameElement = document.createElement('span');
    usernameElement.classList.add('message-sender');
    usernameElement.innerText = id + ': ';
    // テキストコンテンツにメッセージを追加
    div.textContent = message;
    div.insertBefore(usernameElement, div.firstChild);
    // chatMessagesの中身を表示する。
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(div);
}

// 送信ボタンがクリックされたときの処理
function sendMessage() {
    const inputElement = document.querySelector('.chat-input input');
    const message = inputElement.value.trim();

    if (!message) return;

    // JavaScriptオブジェクトをJSONへ変換して送信
    webSocket.send(JSON.stringify([
        document.getElementById('uuid').value,
        document.getElementById('idInput').value,
        message
    ]));

    inputElement.value = ''; // 入力欄をクリア
}

// エンターキーが押されたときの処理
document.querySelector('.chat-input input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        // エンターキーが押されたら送信ボタンをクリックする
        document.querySelector('.send-button').click();
    }
});