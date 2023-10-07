import { useEffect, useState } from 'react';
import { useWS } from './WebSocket';

export default function OpenIa() {
    const ws = useWS();
    const [content, setContent] = useState<{ id: string, choices: [] }>();

    useEffect(() => {
        if (ws) {
            ws.addEventListener('open', () => {
                ws.send('openai');
            });

            ws.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'openai') {
                    const content = data.data;

                    setContent(content);
                }
            });
        }
    }, [ws]);

    return content && content.choices.map((choice: any) =>
        <div key={content.id}>{choice.text}</div>)
}