import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useQueueSocket = (queueId: string | null, onUpdate: () => void) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!queueId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected for queue:', queueId);
        client.subscribe(`/topic/queue/${queueId}`, () => {
          console.log('Queue update received');
          onUpdate();
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [queueId]);
};

export default useQueueSocket;