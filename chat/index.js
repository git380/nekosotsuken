// ダミーメッセージの配列（実際のアプリではサーバーから取得するなど動的に取得する必要があります）
const dummyMessages = [];

// メッセージを表示する関数
function displayMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // 既存のメッセージをクリア

    // chatMessagesの中身をすべて取り出す
    dummyMessages.forEach(message => {
        // divタグの作成
        const div = document.createElement('div');
        // divタグにchat-messageを追加
        div.classList.add('chat-message');
        // { sender: 'You', message }の中身を取り出す
        div.innerHTML = `<span class="message-sender">${message.sender}:</span> ${message.message}`;
        // chatMessagesの中身をすべて表示する。
        chatMessages.appendChild(div);
    });
}

// ページが読み込まれたときにメッセージを表示
document.addEventListener('DOMContentLoaded', function () {
    displayMessages();
});

// エンターキーが押されたときの処理
document.querySelector('.chat-input input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        // エンターキーが押されたら送信ボタンをクリックする
        document.querySelector('.send-button').click();
    }
});

// 送信ボタンがクリックされたときの処理
document.querySelector('.send-button').addEventListener('click', function () {
    const inputElement = document.querySelector('.chat-input input');
    const message = inputElement.value.trim();

    if (message !== '') {
        // 実際のアプリではサーバーにメッセージを送信するなどの処理が必要です
        dummyMessages.push({sender: 'You', message});
        displayMessages(); // メッセージを再表示
        inputElement.value = ''; // 入力欄をクリア
    }
});
