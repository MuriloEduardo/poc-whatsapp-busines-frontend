'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react';

type WSProviderProps = { children: ReactNode; };

const WSStateContext = createContext<WebSocket | null>(null);

function WSProvider({ children }: WSProviderProps): JSX.Element {
    const wsInstance = useMemo(() => {
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}/whatsapp-business/ws`);

        socket.addEventListener('open', () => {
            console.log('Socket is OPEN');
        });

        socket.addEventListener('close', () => {
            console.log('Socket is CLOSED');
        });

        socket.addEventListener('error', (error) => {
            console.error('Socket ERROR:', error);
        });

        return socket;
    }, []);

    return <WSStateContext.Provider value={wsInstance}>{children}</WSStateContext.Provider>;
}

function useWS(): WebSocket {
    const context = useContext(WSStateContext);

    if (!context) {
        throw new Error('useWS must be used within a WSProvider');
    }

    return context;
}

export { WSProvider, useWS };