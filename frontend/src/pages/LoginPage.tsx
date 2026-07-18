import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
  const [tab, setTab] = useState<'citizen' | 'institution'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'citizen'
        ? '/api/auth/citizen/login'
        : '/api/auth/institution/login';
      const res = await api.post(endpoint, { email, password });
      login(res.data.data);
      navigate(tab === 'citizen' ? '/citizen' : '/institution');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px',
          fontWeight: '700', textAlign: 'center' }}>
          Welcome Back
        </h2>
        <div style={{ display: 'flex', marginBottom: '24px',
          background: 'var(--gray-100)', borderRadius: 'var(--radius)',
          padding: '4px' }}>
          {(['citizen', 'institution'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px', border: 'none',
              borderRadius: 'var(--radius)', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--primary)' : 'var(--gray-500)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}>
              {t === 'citizen' ? '👤 Citizen' : '🏛️ Institution'}
            </button>
          ))}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email}
              placeholder="your@email.com"
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password}
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px',
          fontSize: '14px', color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;