'use client'

import { useWS } from './WebSocket';
import { useEffect, useState } from 'react';
import { UnixTimeStampToDate } from '@/components/UnixTimeStampToDate';

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
  profile: Profile;
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

type Message = {
  _id: string;
  object: string;
  entry: Entry[];
};

export default function Home() {
  const ws = useWS();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {messages && messages.map((message) =>
        <div key={message._id}>
          {message.entry.map((entry) =>
            <div key={entry.id}>
              {entry.changes.map((change, index) =>
                <div key={index}>
                  {change.value.messages?.map((message) =>
                    <div key={message.id}>
                      <p>{message.text.body}</p>
                      <UnixTimeStampToDate unixTimeStamp={message.timestamp} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
