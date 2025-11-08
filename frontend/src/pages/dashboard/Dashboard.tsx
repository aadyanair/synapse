import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Input } from '../../components/ui/input.tsx';
import { useAuth } from '../../context/AuthContext';
import { useFolders } from '../../context/FolderContext';
import TodoPanel from '../../components/TodoPanel';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { folders, addFolder } = useFolders();
  const [folderName, setFolderName] = useState('');
  const navigate = useNavigate();

  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    const folder = addFolder(folderName.trim());
    setFolderName('');
    navigate(`/folders/${folder.id}`);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="space-between mb-6">
          <h1>Welcome, {user?.name || 'User'}</h1>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <TodoPanel />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create new folder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="row">
              <div style={{ flex: 1 }} className="stack">
                <Label htmlFor="folder">Folder name</Label>
                <Input id="folder" placeholder="e.g. Research - LLMs" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
              </div>
              <Button onClick={handleAddFolder}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-3">
          {folders.map((f) => (
            <Card key={f.id}>
              <CardHeader>
                <CardTitle>{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="stack">
                <p className="text-sm muted">Add content to this folder:</p>
                <div className="row">
                  <Button variant="secondary" onClick={() => navigate(`/folders/${f.id}`)}>Open</Button>
                </div>
                <div className="pt-2">
                  <Button onClick={() => navigate(`/folders/${f.id}`)} style={{ width: '100%' }}>View & QnA</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {folders.length === 0 && (
          <p className="text-sm muted">No folders yet. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}
