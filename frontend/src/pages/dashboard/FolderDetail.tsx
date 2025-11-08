import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFolders, type ContentType } from '../../context/FolderContext';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Input } from '../../components/ui/input.tsx';

export default function FolderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFolder, addContent } = useFolders();
  const folder = id ? getFolder(id) : undefined;

  const [type, setType] = useState<ContentType>('link');
  const [value, setValue] = useState('');

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

  const handleAdd = () => {
    if (!value.trim()) return;
    addContent(folder.id, type, value.trim());
    setValue('');
  };

  return (
    <div className="page">
      <div className="container stack">
        <div className="space-between">
          <h1>{folder.name}</h1>
          <div className="row">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Back</Button>
            <Button onClick={() => navigate(`/chat/${folder.id}`)}>QnA</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Content</CardTitle>
          </CardHeader>
          <CardContent className="stack">
            <div className="grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
              <div className="stack">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="input"
                  value={type}
                  onChange={(e) => setType(e.target.value as ContentType)}
                >
                  <option value="link">Link</option>
                  <option value="article">Article</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <div className="stack">
                <Label htmlFor="value">{type === 'link' ? 'URL' : type === 'article' ? 'Article content or URL' : 'Text'}</Label>
                <Input
                  id="value"
                  placeholder={type === 'link' ? 'https://...' : 'Enter content'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleAdd}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contents</CardTitle>
          </CardHeader>
          <CardContent className="stack">
            {folder.contents.length === 0 && (
              <p className="text-sm muted">No content yet. Add something to get started.</p>
            )}
            {folder.contents.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                <div>
                  <div className="text-sm" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{c.type}</div>
                  <div className="text-sm muted" style={{ wordBreak: 'break-all' }}>{c.value}</div>
                </div>
                <div className="text-sm muted">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
