import { Link } from 'react-router-dom';
import { Clock, Users, Bell, TrendingUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>🇮🇳 BharatQueue</h1>
        <p>
          Skip the line. Know your wait. Get notified.
          Smart queuing for every Indian government office,
          hospital, and bank.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-lg"
            style={{ background: 'white', color: 'var(--primary)' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-lg btn-outline"
            style={{ borderColor: 'white', color: 'white' }}>
            Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container" style={{ padding: '60px 24px' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--gray-900)'
        }}>
          Why BharatQueue?
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--gray-500)',
          marginBottom: '48px'
        }}>
          No more standing in lines for hours
        </p>

        <div className="grid-3">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--primary-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <Clock size={24} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>
              Real-time Updates
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
              Live queue status via WebSocket.
              Know exactly where you are in the queue.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--success-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <TrendingUp size={24} color="var(--success)" />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>
              Smart ETA
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
              ML-powered wait time prediction.
              "Your turn in ~23 mins" not just a token number.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--warning-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <Bell size={24} color="var(--warning)" />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>
              Email Alerts
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
              Get notified when your turn is near.
              No need to wait in the hall.
            </p>
          </div>
        </div>

        {/* Who is it for */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{
            textAlign: 'center', fontSize: '28px',
            fontWeight: '700', marginBottom: '40px'
          }}>
            Built for everyone
          </h2>
          <div className="grid-2">
            <div className="card" style={{
              borderLeft: '4px solid var(--primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '12px' }}>
                <Users size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '18px' }}>For Citizens</h3>
              </div>
              <ul style={{ color: 'var(--gray-600)', fontSize: '14px',
                paddingLeft: '20px', lineHeight: '2' }}>
                <li>Browse queues near you</li>
                <li>Get a token instantly</li>
                <li>Track your position live</li>
                <li>Get email alerts on your turn</li>
              </ul>
              <Link to="/register" className="btn btn-primary"
                style={{ marginTop: '16px' }}>
                Register as Citizen
              </Link>
            </div>

            <div className="card" style={{
              borderLeft: '4px solid var(--success)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '12px' }}>
                <Users size={24} color="var(--success)" />
                <h3 style={{ fontSize: '18px' }}>For Institutions</h3>
              </div>
              <ul style={{ color: 'var(--gray-600)', fontSize: '14px',
                paddingLeft: '20px', lineHeight: '2' }}>
                <li>Register your hospital / bank / RTO</li>
                <li>Create queues and counters</li>
                <li>Call next token with one click</li>
                <li>View queue analytics</li>
              </ul>
              <Link to="/register" className="btn btn-success"
                style={{ marginTop: '16px' }}>
                Register Institution
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;