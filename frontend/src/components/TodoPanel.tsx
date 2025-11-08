import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { useTodos } from '../context/TodoContext';

export default function TodoPanel() {
  const { todos, addTodo, toggleDone, removeTodo, setReminder, stopReminder } = useTodos();
  const [text, setText] = useState('');
  const [minutes, setMinutes] = useState<number>(30);

  const onAdd = () => {
    const t = text.trim();
    if (!t) return;
    addTodo(t);
    setText('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>To-do with reminders</CardTitle>
      </CardHeader>
      <CardContent className="stack">
        <div className="row">
          <div style={{ flex: 1 }} className="stack">
            <Label htmlFor="todo">New task</Label>
            <Input id="todo" placeholder="e.g. Review paper on RAG" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <Button onClick={onAdd}>Add</Button>
        </div>

        <div className="row">
          <div className="stack" style={{ width: 200 }}>
            <Label htmlFor="interval">Reminder every (minutes)</Label>
            <Input
              id="interval"
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value || '0', 10))}
            />
          </div>
          <p className="text-sm muted">Set a default interval to apply to tasks when you click "Start reminder".</p>
        </div>

        <div className="stack">
          {todos.length === 0 && <p className="text-sm muted">No tasks yet.</p>}
          {todos.map((t) => (
            <div key={t.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
              <div style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</div>
              {t.intervalMinutes ? (
                <>
                  <span className="text-sm muted">every {t.intervalMinutes}m</span>
                  <Button variant="secondary" onClick={() => stopReminder(t.id)}>Stop reminder</Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => setReminder(t.id, minutes)}>Start reminder</Button>
              )}
              <Button variant="outline" onClick={() => removeTodo(t.id)}>Delete</Button>
            </div>
          ))}
        </div>

        {'Notification' in window && Notification.permission === 'denied' && (
          <div className="text-sm" style={{ color: '#b91c1c' }}>
            Notifications are blocked. Enable them in your browser to receive reminders.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
