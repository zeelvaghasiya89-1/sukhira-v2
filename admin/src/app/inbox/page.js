"use client";
import React, { useState, useEffect } from 'react';

export default function InboxDashboard() {
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages'); // messages, subscribers
  
  // Selected message for details view side drawer
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [msgRes, subRes] = await Promise.all([
          fetch('/api/inbox'),
          fetch('/api/subscribers')
        ]);
        const msgData = await msgRes.json();
        const subData = await subRes.json();
        
        if (msgRes.ok) setMessages(msgData.messages || []);
        if (subRes.ok) setSubscribers(subData.subscribers || []);
      } catch (err) {
        console.error('Failed to load Inbox data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', id, status })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!confirm('Remove this subscriber from the mailing list?')) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openMessageDetails = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading Inbox...</div>;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        borderBottom: '1px solid var(--admin-border)',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>Inbox & Leads</h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>Review contact form submissions and newsletter signups</p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`admin-btn ${activeTab === 'messages' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            Messages ({messages.length})
          </button>
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`admin-btn ${activeTab === 'subscribers' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1.5fr 1fr' : '1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Side: Tables */}
        <div className="admin-card" style={{ padding: 0 }}>
          
          {/* TAB 1: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            messages.length === 0 ? (
              <p style={{ color: 'var(--admin-muted)', textAlign: 'center', padding: '60px 0' }}>No contact submissions received yet.</p>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr 
                        key={msg.id}
                        onClick={() => openMessageDetails(msg)}
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: selectedMessage?.id === msg.id ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                          fontWeight: msg.status === 'unread' ? '600' : '400'
                        }}
                      >
                        <td>
                          {msg.status === 'unread' ? (
                            <span className="status-badge status-badge-pending">Unread</span>
                          ) : (
                            <span className="status-badge status-badge-confirmed">Read</span>
                          )}
                        </td>
                        <td>
                          <div style={{ color: '#ffffff' }}>{msg.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{msg.email}</div>
                        </td>
                        <td style={{ color: msg.status === 'unread' ? '#ffffff' : 'var(--admin-muted)' }}>{msg.subject}</td>
                        <td style={{ fontSize: '13px' }}>{new Date(msg.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => openMessageDetails(msg)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', marginRight: '6px' }}
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--admin-danger)' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* TAB 2: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            subscribers.length === 0 ? (
              <p style={{ color: 'var(--admin-muted)', textAlign: 'center', padding: '60px 0' }}>No subscribers joined yet.</p>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Date Joined</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id}>
                        <td style={{ fontWeight: '600', color: '#ffffff' }}>{sub.email}</td>
                        <td>{new Date(sub.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeleteSubscriber(sub.id)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--admin-danger)' }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Right Side: Message Details Side Drawer Panel */}
        {selectedMessage && (
          <div className="admin-card" style={{ animation: 'slideInRight 0.3s ease', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>Message Details</h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-muted)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '4px' }}>Sender</span>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '15px' }}>{selectedMessage.name}</span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--admin-primary)' }}>
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--admin-primary)' }}>{selectedMessage.email}</a>
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '4px' }}>Subject</span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>{selectedMessage.subject}</span>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '4px' }}>Sent At</span>
                <span style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>
                  {new Date(selectedMessage.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '4px' }}>Message Body</span>
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--admin-border)', 
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="admin-btn admin-btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '10px 0' }}
                >
                  Reply via Email
                </a>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="admin-btn admin-btn-secondary"
                  style={{ color: 'var(--admin-danger)', flex: 1 }}
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
