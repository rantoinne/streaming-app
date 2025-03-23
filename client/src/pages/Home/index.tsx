import { useEffect, useRef } from 'react';

type Props = {}

const Home = ({}: Props) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:4000');

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      console.log({ event });
    };

    // Handle connection open
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    // Handle connection close
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);
  
  const sendMessage = () => {
    if (ws.current) {
      ws.current.send("Hello server!");
    }
  };
  
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => {
        fetch('/api/health')
          .then(res => res.json())
          .then(data => console.log(data))
      }}>Click me</button>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default Home