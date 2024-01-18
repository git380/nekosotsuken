import asyncio
import json

import websockets

# クライアントの管理用のセット
clients = set()
chat_history = {}


# クライアントからのメッセージを受信するコルーチン
async def handle_client(websocket):  # 接続が確立された
    print("クライアントが接続しました。")
    try:
        # 新しいクライアントのWebSocket接続をclientsセットに追加
        clients.add(websocket)

        async for message in websocket:
            # 受信したJSONデータをPythonオブジェクトに変換
            data = json.loads(message)
            uuid = data[0]
            client_id = data[1]
            received_message = data[2]
            # JSONチャット履歴を辞書に追加(キーはStringに変換)
            if uuid in chat_history:
                chat_history[uuid].append([client_id, received_message])
            else:
                chat_history[uuid] = [[client_id, received_message]]
            print(chat_history)
            # クライアントからのメッセージをすべてのクライアントにブロードキャスト
            for client in clients:
                await client.send(message)

    finally:  # クライアントが切断された
        print(f"接続が切断されました。")
        # クライアントのWebSocket接続をclientsセットから削除
        clients.remove(websocket)


# WebSocketサーバーを起動
start_server = websockets.serve(handle_client, "localhost", 8765)
print("サーバー起動中...")

# イベントループの開始
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
