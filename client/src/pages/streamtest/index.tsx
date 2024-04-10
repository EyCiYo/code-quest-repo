// components/StreamReceiver.tsx

import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const StreamReceiver: React.FC = () => {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        const eventSource = new EventSource('/api/stream');

        eventSource.onmessage = (event: MessageEvent) => {
            // Append new data to existing data
            let data = JSON.parse(event.data);
            if(data.choices[0].finish_reason === 'stop')
            {
                console.log('Stream finished');
                eventSource.close();
                return;
            }
            let text = data.choices[0].delta.content
            setData(prevData => prevData + text);
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className='bg-red-600 text-black'>
            <Markdown remarkPlugins={[remarkGfm]}>{data}</Markdown>
        </div>
    );
};

export default StreamReceiver;
