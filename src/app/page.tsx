'use client'

import { useEffect } from 'react';
import { useWS } from './WebSocket';

export default function Home() {
  const ws = useWS();

  useEffect(() => {
    if (ws) {
      ws.addEventListener('open', () => {
        ws.send('Olá, servidor WebSocket!');
      });
    }
  }, [ws]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Olá!</h1>
    </main>
  )
}
