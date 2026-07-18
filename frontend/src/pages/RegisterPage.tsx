import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RegisterPage = () => {
  const [tab, setTab] = useState<'citizen' | 'institution'>('citizen');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', city: '', type: 'HOSPITAL'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'citizen'
        ? '/api/auth/citizen/register'
        : '/api/auth/institution/register';
      const payload = tab === 'citizen'
        ? { name: form.name, email: form.email,
            password: form.password, phone: form.phone }
        : { name: form.name, email: form.email,
            password: form.password, phone: form.phone,
            city: form.city, type: form.type };
      const res = await api.post(endpoint, payload);
      login(res.data.data);
      navigate(tab === 'citizen' ? '/citizen' : '/institution');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px',
          fontWeight: '700', textAlign: 'center' }}>
          Create Account
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
            <label>{tab === 'institution' ? 'Institution Name' : 'Full Name'}</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder={tab === 'institution' ? 'AIIMS Delhi' : 'Rahul Sharma'}
              required />
          </div>
          {tab === 'institution' && (
            <>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="BANK">Bank</option>
                  <option value="RTO">RTO</option>
                  <option value="GOVT_OFFICE">Govt Office</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" value={form.city}
                  onChange={handleChange}
                  placeholder="New Delhi" required />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange}
              placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone}
              onChange={handleChange} placeholder="9999999999" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px',
          fontSize: '14px', color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;