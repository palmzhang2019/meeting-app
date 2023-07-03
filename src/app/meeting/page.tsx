'use client';

import { useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import styles from './Meeting.module.css';

export default function Meeting() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [websocket, setWebsocket] = useState<w3cwebsocket | null>(null);

    useEffect(() => {
        // 创建 WebSocket 连接
        const client = new w3cwebsocket('ws://localhost:8765/');

        client.onopen = () => {
            console.log('WebSocket connected');
        };

        client.onmessage = (message) => {
            // 处理收到的消息
            setMessages((prevMessages) => [...prevMessages, message.data]);
        };

        setWebsocket(client);

        // 组件卸载时关闭 WebSocket 连接
        return () => {
            client.close();
        };
    }, []);

    const sendMessage = () => {
        // 发送消息到 WebSocket 服务器
        if (websocket) {
            websocket.send(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div>
            <h1 className={styles.heading}>Meeting</h1>
            <div className={styles.body}>
                <div>
                    {messages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </div>
                <input
                    className={styles.input}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button className={styles.button} onClick={sendMessage}>送信</button>
            </div>

        </div>
    );
}
