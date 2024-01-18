// メッセージを表示する関数
function displayMessages(message) {
    // divタグの作成
    const div = document.createElement('div');
    // divタグにchat-messageを追加
    div.classList.add('chat-message');
    //ユーザー名の要素を作成し追加
    const usernameElement = document.createElement('span');
    usernameElement.classList.add('message-sender');
    usernameElement.innerText = 'You: ';
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

    displayMessages(message); // メッセージを再表示
    inputElement.value = ''; // 入力欄をクリア
}

// エンターキーが押されたときの処理
document.querySelector('.chat-input input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        // エンターキーが押されたら送信ボタンをクリックする
        document.querySelector('.send-button').click();
    }
});