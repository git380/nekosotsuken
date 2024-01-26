import asyncio
import json

import websockets

# クライアントの管理用のセット
clients = set()


async def notion_client(websocket):
    print('notion-クライアントが接続しました。')
    try:
        clients.add(websocket)

        async for message in websocket:
            data = json.loads(message)
            message_id = data[0]
            client_id = data[1]
            title = data[2]
            link = data[3]
            with open('note/testVer1/python/notion_history.json', 'r', encoding='utf-8') as json_file_r:
                notion_history = json.load(json_file_r)
            notion_history[str(message_id)] = [client_id, title, link]
            with open('notion_history.json', 'w', encoding='utf-8') as json_file_w:
                json.dump(notion_history, json_file_w, ensure_ascii=False, indent=4)
            for client in clients:
                await client.send(message)

    finally:
        print('notion-接続が切断されました。')
        clients.remove(websocket)


async def chat_client(websocket):
    print('chat-クライアントが接続しました。')
    try:
        clients.add(websocket)

        async for message in websocket:
            data = json.loads(message)
            if isinstance(data, list):
                uuid = data[0]
                client_id = data[1]
                received_message = data[2]
                with open('chat/json/chat_history.json', 'r', encoding='utf-8') as json_file_r:
                    chat_history = json.load(json_file_r)
                if uuid in chat_history:
                    chat_history[uuid].append([client_id, received_message])
                else:
                    chat_history[uuid] = [[client_id, received_message]]
                with open('chat/json/chat_history.json', 'w', encoding='utf-8') as json_file_w:
                    json.dump(chat_history, json_file_w, ensure_ascii=False, indent=4)
            else:
                uuid = data.get('data', '')[0]
                client_id = data.get('data', '')[1]
                name = data.get('data', '')[2]
                status = data.get('data', '')[3]
                with open('chat/json/group_info.json', 'r', encoding='utf-8') as json_file_r:
                    group_info = json.load(json_file_r)
                if uuid in group_info:
                    group_info[uuid][0][client_id] = [name, status]
                else:
                    group_info[uuid] = [{client_id: [name, status]}]
                with open('chat/json/group_info.json', 'w', encoding='utf-8') as json_file_w:
                    json.dump(group_info, json_file_w, ensure_ascii=False, indent=4)
            for client in clients:
                await client.send(message)

    finally:
        print('chat-接続が切断されました。')
        clients.remove(websocket)


async def canvas_client(websocket):
    print('canvas-クライアントが接続しました。')
    clients.add(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            uuid = data[0]
            with open('paint/canvas_history.json', 'r', encoding='utf-8') as json_file_r:
                canvas_history = json.load(json_file_r)
            if data[1] == 'clear':
                canvas_history[uuid].clear()
            else:
                data = data[1:]
                color = '#{:02x}{:02x}{:02x}'.format(*map(int, data[0][4:-1].split(', ')))
                data[0] = color[:2] + color[3] + color[5]
                if uuid in canvas_history:
                    canvas_history[uuid].append(data)
                else:
                    canvas_history[uuid] = [data]
            with open('paint/canvas_history.json', 'w', encoding='utf-8') as json_file_w:
                json.dump(canvas_history, json_file_w, ensure_ascii=False, indent=4)
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)
        print('canvas-接続が切断されました。')


# WebSocketサーバーを起動
notion = websockets.serve(notion_client, 'localhost', 8765)
chat = websockets.serve(chat_client, 'localhost', 8766)
canvas = websockets.serve(canvas_client, 'localhost', 8124)
print('サーバー起動中...')

# イベントループの開始
asyncio.get_event_loop().run_until_complete(notion)
asyncio.get_event_loop().run_until_complete(chat)
asyncio.get_event_loop().run_until_complete(canvas)
asyncio.get_event_loop().run_forever()
