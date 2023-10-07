'use client'

import { useWS } from './WebSocket';
import StatusMessage from './StatusMessage';
import { FormEvent, useEffect, useState } from 'react';
import { UnixTimeStampToDate } from './UnixTimeStampToDate';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

type ValueMessageText = {
    body: string;
};

type ValueMessage = {
    id: string;
    type: string;
    from: string;
    timestamp: string;
    text: ValueMessageText;
};

type Profile = {
    name: string;
};

type Contact = {
    wa_id: string;
    profile?: Profile;
    input?: string;
};

type Origin = {
    type: string;
};

type Conversation = {
    id: string;
    origin: Origin;
};

type Pricing = {
    billable: boolean;
    category: string;
    pricing_model: string;
};

type Status = {
    id: string;
    status: string;
    timestamp: string;
    recipient_id: string;
    pricing: Pricing;
    conversation: Conversation;
};

type Metadata = {
    display_phone_number: string;
    phone_number_id: string;
};

type Value = {
    metadata: Metadata;
    statuses?: Status[];
    messages?: ValueMessage[];
    contacts?: Contact[];
    messaging_product: string;
};

type Change = {
    field: string;
    value: Value;
};

type Entry = {
    id: string;
    changes: Change[];
};

type MessagesSended = {
    id: string;
    type: string;
    text: ValueMessageText;
    timestamps: string;
    data: ValueMessage;
};

export type Message = {
    _id: string;
    object: string;
    entry?: Entry[];
    messaging_product?: string;
    messages?: MessagesSended[];
    contacts?: Contact[];
};

export default function Messages() {
    const ws = useWS();
    const [message, setMessage] = useState<string>();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (ws) {
            ws.addEventListener('open', () => {
                // ws.send('Olá, servidor WebSocket!');
            });

            ws.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);

                if (data instanceof Array) {
                    setMessages(data);
                } else {
                    setMessages(state => {
                        const itemExists = state.some((item) => item._id === data._id);

                        if (!itemExists) {
                            return [...state, data];
                        }

                        return state;
                    });
                }
            });
        }
    }, [ws]);

    const sendMessage = async (event: FormEvent) => {
        event.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp-business/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        setMessage('');
    }

    return <div className='p-4'>
        <div className='flex flex-col'>
            {messages && messages.map((message) =>
                <div key={message._id}>
                    {message.entry && message.entry.map((entry) =>
                        <div key={entry.id}>
                            {entry.changes.map((change, index) =>
                                <div key={index}>
                                    {change.value.messages?.map((message) =>
                                        <div key={message.id} className='text-left'>
                                            <p>{message.text.body}</p>
                                            <UnixTimeStampToDate unixTimeStamp={message.timestamp} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {!message.entry && message.messages?.length && message.messages.map((send_message) =>
                        <div key={message._id} className='text-right'>
                            <p>{send_message.data.text.body}</p>
                            <div className="flex gap-2 justify-end">
                                <UnixTimeStampToDate unixTimeStamp={send_message.timestamps} />
                                <StatusMessage messages={messages} message={message} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        <form onSubmit={(e) => sendMessage(e)} className='flex mt-6'>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className='grow rounded p-4' />
            <button type="submit" className='p-4' disabled={!message}>
                <PaperAirplaneIcon className='w-6' />
            </button>
        </form>
    </div>
}