import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <div className="page center">
      <Card style={{ width: '100%', maxWidth: 448 }}>
        <CardHeader>
          <CardTitle style={{ textAlign: 'center', fontSize: 24, fontWeight: 600 }}>Create your account</CardTitle>
          <CardDescription style={{ textAlign: 'center' }}>Enter your details to sign up</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="stack">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="stack">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
            </div>
            <div className="stack">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
            </div>
            <div className="stack">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter className="stack">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link to="/login">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
