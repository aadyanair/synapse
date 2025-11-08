import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Input } from '../../components/ui/input.tsx';
import { useFolders } from '../../context/FolderContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFolder } = useFolders();
  const folder = id ? getFolder(id) : undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (!folder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Folder not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // TODO: Replace with backend call. Mocking assistant response for now.
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Mock answer about folder "${folder.name}" with ${folder.contents.length} items. You asked: ${text}`,
    };
    setTimeout(() => setMessages((prev) => [...prev, assistantMsg]), 400);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page">
      <div className="container stack">
        <div className="space-between">
          <h1>QnA: {folder.name}</h1>
          <div className="row">
            <Button variant="outline" onClick={() => navigate(`/folders/${folder.id}`)}>Back to Folder</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          </div>
        </div>

        <Card style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
            {messages.length === 0 && (
              <p className="text-sm muted">Ask a question about this folder's content.</p>
            )}
            <div className="stack">
              {messages.map((m) => (
                <div key={m.id} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      borderRadius: 12,
                      padding: '8px 12px',
                      fontSize: 14,
                      background: m.role === 'user' ? '#2563eb' : '#eef2ff',
                      color: m.role === 'user' ? '#ffffff' : '#0f172a',
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="row">
          <Input
            placeholder="Type your question and press Enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
