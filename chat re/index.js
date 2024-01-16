function openChat(chatName) {
    // チャットごとに異なるダミーメッセージを設定
    let dummyMessages = [];

    if (chatName === 'Chat1') {
        dummyMessages = [
            "Hello from Chat 1!",
            "How's it going?",
            "This is Chat 1's message."
        ];
    } else if (chatName === 'Chat2') {
        dummyMessages = [
            "Hi there!",
            "This is Chat 2.",
            "Nice to meet you!"
        ];
    } else if (chatName === 'Chat3') {
        dummyMessages = [
            "Welcome to Chat 3!",
            "Feel free to chat here.",
            "This is Chat 3's message."
        ];
    }

    // ダミーメッセージをHTMLに変換して表示
    document.getElementById('chatContent').innerHTML = dummyMessages.map(message => `<div class="message-container">
<strong>User:</strong> ${message}</div>`).join('');
}
