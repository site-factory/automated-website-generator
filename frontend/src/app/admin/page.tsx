"use client";

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import type { LeadRecord, LeadStatus } from '@/lib/supabase';

const retentionDays = 30;

function cleanupDue(lead: LeadRecord) {
  const ageMs = Date.now() - new Date(lead.createdAt).getTime();
  return lead.status !== 'converted'
    && lead.cleanupStatus === 'active'
    && ageMs > retentionDays * 24 * 60 * 60 * 1000;
}

function cleanupLabel(lead: LeadRecord) {
  if (lead.status === 'converted') return <><ShieldCheck size={14} /> protected</>;
  if (lead.cleanupStatus === 'deleted') return <><Trash2 size={14} /> deleted</>;
  if (lead.cleanupStatus === 'skipped') return 'skipped';
  if (lead.cleanupStatus === 'failed') return 'failed';
  if (cleanupDue(lead)) return <><Trash2 size={14} /> cleanup due</>;
  return 'safe';
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then(async (res) => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to load leads');
        return res.json();
      })
      .then((data) => {
        if (data?.leads) {
          setAuthenticated(true);
          setLeads(data.leads);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cleanupCount = useMemo(() => leads.filter(cleanupDue).length, [leads]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError('Invalid password');
      return;
    }

    const leadsRes = await fetch('/api/admin/leads');
    const data = await leadsRes.json();
    setLeads(data.leads || []);
    setAuthenticated(true);
    setPassword('');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setLeads([]);
  }

  async function patchLead(id: string, patch: Partial<Pick<LeadRecord, 'status' | 'notes'>>) {
    setSavingId(id);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (data.lead) {
      setLeads((current) => current.map((lead) => lead.id === id ? data.lead : lead));
    }
    setSavingId(null);
  }

  if (loading) {
    return <main className="admin-shell"><p>Loading admin console...</p></main>;
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={login} className="surface-card admin-login-card">
          <h1>Admin Login</h1>
          <p className="muted">Private owner console for website leads.</p>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="btn-cyan" type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Lead Management</h1>
          <p className="muted">Mark converted leads to protect their repositories from janitor cleanup.</p>
        </div>
        <button onClick={logout} className="admin-link-button"><LogOut size={16} /> Logout</button>
      </header>

      <section className="admin-metrics">
        <div className="surface-card admin-metric">
          <span>Total leads</span>
          <strong>{leads.length}</strong>
        </div>
        <div className="surface-card admin-metric">
          <span>Protected</span>
          <strong>{leads.filter((lead) => lead.status === 'converted').length}</strong>
        </div>
        <div className="surface-card admin-metric">
          <span>Cleanup due</span>
          <strong>{cleanupCount}</strong>
        </div>
      </section>

      <section className="surface-card admin-table-wrap">
        {leads.length === 0 ? (
          <div className="admin-empty">No leads yet.</div>
        ) : (
          <div className="admin-table">
            <div className="admin-row admin-row-head">
              <span>Business</span>
              <span>Email</span>
              <span>Industry</span>
              <span>Status</span>
              <span>Created</span>
              <span>Links</span>
              <span>Notes</span>
              <span>Cleanup</span>
            </div>
            {leads.map((lead) => (
              <div className="admin-row" key={lead.id}>
                <strong>{lead.businessName}</strong>
                <span>{lead.email}</span>
                <span>{lead.industry}</span>
                <select
                  value={lead.status}
                  disabled={savingId === lead.id}
                  onChange={(event) => patchLead(lead.id, { status: event.target.value as LeadStatus })}
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="converted">converted</option>
                  <option value="archived">archived</option>
                </select>
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                <span className="admin-links">
                  {lead.demoUrl ? <a href={lead.demoUrl} target="_blank" rel="noreferrer">Demo <ExternalLink size={14} /></a> : '—'}
                  {lead.githubRepoUrl ? <a href={lead.githubRepoUrl} target="_blank" rel="noreferrer">Repo <ExternalLink size={14} /></a> : null}
                </span>
                <textarea
                  value={lead.notes || ''}
                  placeholder="Internal notes"
                  onBlur={(event) => patchLead(lead.id, { notes: event.target.value })}
                  onChange={(event) => setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, notes: event.target.value } : item))}
                />
                <span className={cleanupDue(lead) ? 'admin-risk due' : 'admin-risk safe'}>
                  {cleanupLabel(lead)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
