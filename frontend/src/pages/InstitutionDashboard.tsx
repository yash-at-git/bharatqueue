import { useState, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

interface QueueItem {
  id: string;
  name: string;
  prefix: string;
  waitingCount: number;
}

interface CounterItem {
  id: string;
  name: string;
  isActive: boolean;
}

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);
  const [counters, setCounters] = useState<CounterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQueue, setNewQueue] = useState({ name: '', prefix: '' });
  const [newCounter, setNewCounter] = useState('');
  const [message, setMessage] = useState('');
  const [callingNext, setCallingNext] = useState<string | null>(null);

  useEffect(() => { fetchQueues(); }, []);

  const fetchQueues = async () => {
    try {
      const res = await api.get('/api/institution/queues');
      setQueues(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounters = async (queueId: string) => {
    try {
      const res = await api.get(
        `/api/institution/queues/${queueId}/counters`);
      setCounters(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectQueue = (queue: QueueItem) => {
    setSelectedQueue(queue);
    fetchCounters(queue.id);
  };

  const createQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/institution/queues', {
        name: newQueue.name,
        prefix: newQueue.prefix,
        dailyResetHour: 0
      });
      setNewQueue({ name: '', prefix: '' });
      setMessage('Queue created successfully!');
      fetchQueues();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage(e.response?.data?.message || 'Failed to create queue');
    }
  };

  const createCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQueue) return;
    try {
      await api.post(
        `/api/institution/queues/${selectedQueue.id}/counters`,
        { name: newCounter }
      );
      setNewCounter('');
      setMessage('Counter created!');
      fetchCounters(selectedQueue.id);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage(e.response?.data?.message || 'Failed to create counter');
    }
  };

  const callNext = async (counterId: string) => {
    setCallingNext(counterId);
    setMessage('');
    try {
      const res = await api.put(
        `/api/institution/counters/${counterId}/call-next`);
      setMessage(`Called: ${res.data.data.tokenNumber}`);
      fetchQueues();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage(e.response?.data?.message || 'No waiting tokens');
    } finally {
      setCallingNext(null);
    }
  };

  if (loading) return (
    <div className="loading"><div className="spinner" />Loading...</div>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>{user?.name} Dashboard 🏛️</h1>
          <p>Manage your queues and counters</p>
        </div>

        {message && (
          <div className={`alert ${
            message.includes('success') ||
            message.includes('Called') ||
            message.includes('created')
              ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="grid-2">
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px',
                fontWeight: '600' }}>
                Create New Queue
              </h3>
              <form onSubmit={createQueue}>
                <div className="form-group">
                  <label>Queue Name</label>
                  <input value={newQueue.name} placeholder="OPD Queue"
                    onChange={e => setNewQueue({
                      ...newQueue, name: e.target.value })}
                    required />
                </div>
                <div className="form-group">
                  <label>Prefix</label>
                  <input value={newQueue.prefix} placeholder="OPD"
                    maxLength={10}
                    onChange={e => setNewQueue({
                      ...newQueue, prefix: e.target.value })}
                    required />
                </div>
                <button type="submit"
                  className="btn btn-primary btn-full">
                  <Plus size={16} /> Create Queue
                </button>
              </form>
            </div>

            <h3 style={{ marginBottom: '12px', fontSize: '16px',
              fontWeight: '600' }}>
              Your Queues
            </h3>
            {queues.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
                No queues yet. Create one above.
              </p>
            ) : queues.map(queue => (
              <div key={queue.id} onClick={() => selectQueue(queue)}
                style={{
                  background: selectedQueue?.id === queue.id
                    ? 'var(--primary-light)' : 'white',
                  border: `1px solid ${selectedQueue?.id === queue.id
                    ? 'var(--primary)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius)', padding: '16px',
                  marginBottom: '8px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', transition: 'all 0.2s'
                }}>
                <div>
                  <div style={{ fontWeight: '600',
                    color: 'var(--gray-900)' }}>
                    {queue.name}
                  </div>
                  <div style={{ fontSize: '13px',
                    color: 'var(--gray-500)' }}>
                    {queue.waitingCount} waiting
                  </div>
                </div>
                <ChevronRight size={16} color="var(--gray-400)" />
              </div>
            ))}
          </div>

          <div>
            {selectedQueue ? (
              <>
                <div className="card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '4px', fontSize: '16px',
                    fontWeight: '600' }}>
                    {selectedQueue.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)',
                    marginBottom: '16px' }}>
                    {selectedQueue.waitingCount} people waiting
                  </p>
                  <form onSubmit={createCounter}
                    style={{ display: 'flex', gap: '8px' }}>
                    <input value={newCounter}
                      placeholder="e.g. Counter 1"
                      onChange={e => setNewCounter(e.target.value)}
                      required style={{
                        flex: 1, padding: '10px 14px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '14px', outline: 'none'
                      }} />
                    <button type="submit" className="btn btn-primary">
                      <Plus size={16} />
                    </button>
                  </form>
                </div>

                <h3 style={{ marginBottom: '12px', fontSize: '16px',
                  fontWeight: '600' }}>
                  Counters
                </h3>
                {counters.length === 0 ? (
                  <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
                    No counters yet. Add one above.
                  </p>
                ) : counters.map(counter => (
                  <div key={counter.id} className="card"
                    style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>
                          {counter.name}
                        </div>
                        <div style={{ fontSize: '12px',
                          color: 'var(--gray-400)', marginTop: '2px' }}>
                          {counter.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <button className="btn btn-success"
                        onClick={() => callNext(counter.id)}
                        disabled={callingNext === counter.id}>
                        {callingNext === counter.id
                          ? 'Calling...' : '📣 Call Next'}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="card" style={{ textAlign: 'center',
                padding: '60px', color: 'var(--gray-400)' }}>
                <ChevronRight size={48}
                  style={{ margin: '0 auto 16px', display: 'block' }} />
                <p>Select a queue to manage its counters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;