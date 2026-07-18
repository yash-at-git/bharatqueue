import { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import useQueueSocket from '../hooks/useQueueSocket';

interface QueueItem {
  id: string;
  name: string;
  prefix: string;
  institutionName: string;
  institutionCity: string;
  waitingCount: number;
}

interface TokenItem {
  id: string;
  queueId: string;
  tokenNumber: string;
  status: string;
  position: number;
  issuedAt: string;
  queueName: string;
  institutionName: string;
  estimatedWaitMinutes: number;
}

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [myTokens, setMyTokens] = useState<TokenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'queues' | 'tokens'>('queues');

  const activeToken = myTokens.find(t =>
    t.status === 'WAITING' || t.status === 'SERVING'
  );

  // WebSocket — auto refresh when queue updates
  useQueueSocket(activeToken?.queueId ?? null, () => {
    fetchData();
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [queuesRes, tokensRes] = await Promise.all([
        api.get('/api/queues'),
        api.get('/api/citizen/tokens')
      ]);
      setQueues(queuesRes.data.data);
      setMyTokens(tokensRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (queueId: string) => {
    setJoining(queueId);
    setMessage('');
    try {
      await api.post(`/api/queues/${queueId}/join`);
      setMessage('Successfully joined queue!');
      fetchData();
      setTab('tokens');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage(e.response?.data?.message || 'Failed to join queue');
    } finally {
      setJoining(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      WAITING: 'badge-waiting',
      SERVING: 'badge-serving',
      COMPLETED: 'badge-completed',
      SKIPPED: 'badge-skipped'
    };
    return `badge ${map[status] || 'badge-waiting'}`;
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner" />Loading...
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Browse queues or check your active tokens</p>
          {activeToken && (
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              gap: '6px', marginTop: '8px', padding: '4px 12px',
              background: 'var(--success-light)',
              color: 'var(--success)', borderRadius: '999px',
              fontSize: '12px', fontWeight: '500'
            }}>
              <span style={{ width: '6px', height: '6px',
                background: 'var(--success)', borderRadius: '50%',
                display: 'inline-block' }} />
              Live updates active
            </div>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('Success')
            ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button onClick={() => setTab('queues')}
            className={`btn ${tab === 'queues'
              ? 'btn-primary' : 'btn-outline'}`}>
            <Users size={16} /> Browse Queues
          </button>
          <button onClick={() => setTab('tokens')}
            className={`btn ${tab === 'tokens'
              ? 'btn-primary' : 'btn-outline'}`}>
            <Ticket size={16} /> My Tokens ({myTokens.length})
          </button>
        </div>

        {tab === 'queues' && (
          <div className="grid-3">
            {queues.length === 0 ? (
              <p style={{ color: 'var(--gray-500)' }}>
                No active queues available.
              </p>
            ) : queues.map(queue => (
              <div key={queue.id} className="queue-card">
                <div className="queue-card-header">
                  <div>
                    <div className="queue-card-title">{queue.name}</div>
                    <div className="queue-card-institution">
                      <MapPin size={12} style={{ display: 'inline' }} />
                      {' '}{queue.institutionName}, {queue.institutionCity}
                    </div>
                  </div>
                  <span className="badge" style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)' }}>
                    {queue.prefix}
                  </span>
                </div>
                <div className="queue-card-stats">
                  <div className="queue-stat">
                    <div className="queue-stat-value">
                      {queue.waitingCount}
                    </div>
                    <div className="queue-stat-label">Waiting</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-full"
                  style={{ marginTop: '16px' }}
                  onClick={() => joinQueue(queue.id)}
                  disabled={joining === queue.id}>
                  {joining === queue.id ? 'Joining...' : 'Join Queue'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'tokens' && (
          <div>
            {myTokens.length === 0 ? (
              <div className="card" style={{ textAlign: 'center',
                padding: '60px' }}>
                <Ticket size={48} color="var(--gray-300)"
                  style={{ margin: '0 auto 16px', display: 'block' }} />
                <p style={{ color: 'var(--gray-500)' }}>
                  You haven't joined any queues yet.
                </p>
                <button onClick={() => setTab('queues')}
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}>
                  Browse Queues
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex',
                flexDirection: 'column', gap: '16px' }}>
                {myTokens.map(token => (
                  <div key={token.id} className="card"
                    style={{
                      borderLeft: token.status === 'SERVING'
                        ? '4px solid var(--success)'
                        : token.status === 'WAITING'
                        ? '4px solid var(--primary)'
                        : '4px solid var(--gray-200)'
                    }}>
                    <div style={{ display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center' }}>
                      <div style={{ display: 'flex',
                        alignItems: 'center', gap: '20px' }}>
                        <div className="token-number"
                          style={{ fontSize: '40px',
                            color: token.status === 'SERVING'
                              ? 'var(--success)' : 'var(--primary)' }}>
                          {token.tokenNumber}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600',
                            color: 'var(--gray-900)' }}>
                            {token.queueName}
                          </div>
                          <div style={{ fontSize: '13px',
                            color: 'var(--gray-500)' }}>
                            {token.institutionName}
                          </div>
                          {token.status === 'WAITING' && (
                            <div style={{ fontSize: '13px',
                              color: 'var(--primary)', marginTop: '4px' }}>
                              <Clock size={12} style={{
                                display: 'inline', marginRight: '4px' }} />
                              ETA: ~{token.estimatedWaitMinutes} mins
                            </div>
                          )}
                          {token.status === 'SERVING' && (
                            <div style={{ fontSize: '13px',
                              color: 'var(--success)', marginTop: '4px',
                              fontWeight: '600' }}>
                              🎉 It's your turn! Please proceed to counter.
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={getStatusBadge(token.status)}>
                        {token.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;