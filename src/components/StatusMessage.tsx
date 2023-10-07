import { Message } from "./Messages";
import { useEffect, useState } from "react"
import { CheckIcon } from '@heroicons/react/24/solid'

export default function StatusMessage({ messages, message }: { messages: Message[], message: Message }) {
    const [statusMessage, setStatusMessage] = useState<any>([]);

    useEffect(() => {
        const statusMessages = messages
            .filter((_message) => {
                if (_message.entry?.length) {
                    const [first_entry] = _message.entry;

                    if (first_entry.changes?.length) {
                        const [change] = first_entry.changes;
                        const statuses = change.value.statuses;

                        if (statuses?.length) {
                            const [first_status] = statuses;

                            if (message.messages?.length) {
                                const [first_message] = message.messages;

                                return first_status.id === first_message.id;
                            }
                        }
                    }
                }
            })
            .map((message) => {
                if (message.entry) {
                    const [first_entry] = message.entry
                    const [change] = first_entry.changes;
                    const statuses = change.value.statuses;

                    if (statuses?.length) {
                        const [first_status] = statuses;

                        return first_status.status;
                    }
                }
            })
            .filter((status) => status);

        setStatusMessage(statusMessages);
    }, [messages]);

    const colorStatus = statusMessage.includes('read') ? 'text-blue-500' : '';

    return <>
        <div className={`m-1 flex ${colorStatus}`}>
            {statusMessage.includes('delivered') && <CheckIcon className='w-3 -m-1' />}
            {statusMessage.includes('sent') && <CheckIcon className='w-3 -m-1' />}
        </div>
        {statusMessage.includes('failed') && <span className='text-red-500'>Failed</span>}
    </>
}