import asyncio
import json

import websockets

# クライアントの管理用のセット
clients = set()
contact_history = {}


# クライアントからのメッセージを受信するコルーチン
async def handle_client(websocket):  # 接続が確立された
    print('クライアントが接続しました。')
    try:
        # 新しいクライアントのWebSocket接続をclientsセットに追加
        clients.add(websocket)

        async for message in websocket:
            # 受信したJSONデータをPythonオブジェクトに変換
            data = json.loads(message)
            # dataオブジェクトには'messageId', 'client_id', 'message'が含まれる
            message_id = data[0]
            client_id = data[1]
            title = data[2]
            link = data[3]
            # JSONチャット履歴を辞書に追加(キーはStringに変換)
            contact_history[str(message_id)] = [client_id, title, link]
            print(f'chat_history追加：{contact_history}')
            # クライアントからのメッセージをすべてのクライアントにブロードキャスト
            for client in clients:
                await client.send(message)

    finally:  # クライアントが切断された
        print(f'接続が切断されました。')
        # クライアントのWebSocket接続をclientsセットから削除
        clients.remove(websocket)


# WebSocketサーバーを起動
start_server = websockets.serve(handle_client, 'localhost', 8765)
print('サーバー起動中...')

# イベントループの開始
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
