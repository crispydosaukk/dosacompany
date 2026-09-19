'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Settings, Save, Store, Clock, CreditCard, Mail, Bell, Globe, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface OpeningHour {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

const DAYS: OpeningHour[] = [
  { day: 'Monday', open: true, from: '12:00', to: '22:30' },
  { day: 'Tuesday', open: true, from: '12:00', to: '22:30' },
  { day: 'Wednesday', open: true, from: '12:00', to: '22:30' },
  { day: 'Thursday', open: true, from: '12:00', to: '22:30' },
  { day: 'Friday', open: true, from: '12:00', to: '23:00' },
  { day: 'Saturday', open: true, from: '11:30', to: '23:00' },
  { day: 'Sunday', open: true, from: '11:30', to: '22:00' },
];

interface SectionProps { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--admin-card)', borderColor: 'var(--admin-border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-admin-muted">{icon}</span>
          <span className="font-extrabold text-admin-foreground">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-admin-muted" /> : <ChevronDown size={16} className="text-admin-muted" />}
      </button>
      {open && <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--admin-border)' }}><div className="pt-5">{children}</div></div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-admin-muted mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none focus:border-primary"
      style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
    />
  );
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [hours, setHours] = useState<OpeningHour[]>(DAYS);
  const [acceptOrders, setAcceptOrders] = useState(true);

  const [restaurant, setRestaurant] = useState({
    name: 'Dosa Company',
    address: 'Milton Keynes, UK',
    phone: '+44 1234 567890',
    email: 'info@dosacompany.co.uk',
    website: 'https://dosacompany.co.uk',
    currency: 'GBP',
    vatRate: '20',
    prepTime: '20',
  });

  const [payment, setPayment] = useState({
    stripeMode: 'test',
    stripePublicKey: '',
    stripeWebhookSecret: '',
  });

  const [emailSettings, setEmailSettings] = useState({
    provider: 'resend',
    apiKey: '',
    fromEmail: 'orders@dosacompany.co.uk',
    fromName: 'Dosa Company',
    sendConfirmation: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateHour = (index: number, field: keyof OpeningHour, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  return (
    <AdminLayout activePage="settings">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,32,36,0.15)' }}>
              <Settings size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-admin-foreground">Settings</h1>
              <p className="text-xs text-admin-muted mt-0.5">Manage restaurant configuration</p>
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all" style={{ background: saved ? '#10984B' : 'var(--primary)' }}>
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>

        {/* Order Accept Toggle */}
        <div className="flex items-center justify-between p-5 rounded-2xl border mb-4" style={{ background: acceptOrders ? 'rgba(16,152,75,0.08)' : 'rgba(239,68,68,0.08)', borderColor: acceptOrders ? 'rgba(16,152,75,0.3)' : 'rgba(239,68,68,0.3)' }}>
          <div>
            <p className="font-extrabold text-admin-foreground">{acceptOrders ? '✅ Accepting Orders' : '🔴 Orders Paused'}</p>
            <p className="text-xs text-admin-muted mt-0.5">{acceptOrders ? 'Customers can place new orders' : 'New orders are blocked for all tables'}</p>
          </div>
          <button
            onClick={() => setAcceptOrders(!acceptOrders)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ background: acceptOrders ? '#EF4444' : '#10984B' }}
          >
            {acceptOrders ? 'Stop Orders' : 'Accept Orders'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Restaurant Info */}
          <Section title="Restaurant Information" icon={<Store size={18} />} defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Restaurant Name"><Input value={restaurant.name} onChange={(v) => setRestaurant(r => ({ ...r, name: v }))} /></Field>
              <Field label="Phone"><Input value={restaurant.phone} onChange={(v) => setRestaurant(r => ({ ...r, phone: v }))} /></Field>
              <Field label="Email"><Input value={restaurant.email} onChange={(v) => setRestaurant(r => ({ ...r, email: v }))} type="email" /></Field>
              <Field label="Website"><Input value={restaurant.website} onChange={(v) => setRestaurant(r => ({ ...r, website: v }))} /></Field>
              <div className="sm:col-span-2">
                <Field label="Address"><Input value={restaurant.address} onChange={(v) => setRestaurant(r => ({ ...r, address: v }))} /></Field>
              </div>
            </div>
          </Section>

          {/* Order Settings */}
          <Section title="Order & VAT Settings" icon={<Globe size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Currency">
                <select value={restaurant.currency} onChange={(e) => setRestaurant(r => ({ ...r, currency: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </Field>
              <Field label="Default VAT Rate (%)"><Input value={restaurant.vatRate} onChange={(v) => setRestaurant(r => ({ ...r, vatRate: v }))} type="number" /></Field>
              <Field label="Default Prep Time (mins)"><Input value={restaurant.prepTime} onChange={(v) => setRestaurant(r => ({ ...r, prepTime: v }))} type="number" /></Field>
            </div>
          </Section>

          {/* Opening Hours */}
          <Section title="Opening Hours" icon={<Clock size={18} />}>
            <div className="space-y-3">
              {hours.map((h, i) => (
                <div key={h.day} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-admin-foreground w-24 flex-shrink-0">{h.day}</span>
                  <button
                    onClick={() => updateHour(i, 'open', !h.open)}
                    className="w-10 h-5 rounded-full transition-colors flex-shrink-0 relative"
                    style={{ background: h.open ? '#10984B' : '#374151' }}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${h.open ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                  {h.open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={h.from} onChange={(e) => updateHour(i, 'from', e.target.value)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} />
                      <span className="text-admin-muted text-sm">–</span>
                      <input type="time" value={h.to} onChange={(e) => updateHour(i, 'to', e.target.value)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-admin-foreground border outline-none focus:border-primary" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }} />
                    </div>
                  ) : (
                    <span className="text-sm text-admin-muted italic">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Payment Settings */}
          <Section title="Payment Settings" icon={<CreditCard size={18} />}>
            <div className="space-y-4">
              <Field label="Stripe Mode">
                <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--admin-border)' }}>
                  {(['test', 'live'] as const).map((m) => (
                    <button key={m} onClick={() => setPayment(p => ({ ...p, stripeMode: m }))} className="flex-1 py-2.5 text-sm font-bold transition-colors capitalize" style={{ background: payment.stripeMode === m ? (m === 'live' ? 'var(--primary)' : '#10984B') : 'transparent', color: payment.stripeMode === m ? '#fff' : 'var(--admin-muted)' }}>
                      {m === 'test' ? '🧪 Test Mode' : '🔴 Live Mode'}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Stripe Publishable Key"><Input value={payment.stripePublicKey} onChange={(v) => setPayment(p => ({ ...p, stripePublicKey: v }))} placeholder="pk_test_..." /></Field>
              <Field label="Stripe Webhook Secret"><Input value={payment.stripeWebhookSecret} onChange={(v) => setPayment(p => ({ ...p, stripeWebhookSecret: v }))} placeholder="whsec_..." type="password" /></Field>
            </div>
          </Section>

          {/* Email Settings */}
          <Section title="Email Settings" icon={<Mail size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Provider">
                <select value={emailSettings.provider} onChange={(e) => setEmailSettings(s => ({ ...s, provider: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-admin-foreground border outline-none" style={{ background: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}>
                  <option value="resend">Resend</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="smtp">SMTP</option>
                </select>
              </Field>
              <Field label="API Key"><Input value={emailSettings.apiKey} onChange={(v) => setEmailSettings(s => ({ ...s, apiKey: v }))} placeholder="re_..." type="password" /></Field>
              <Field label="From Email"><Input value={emailSettings.fromEmail} onChange={(v) => setEmailSettings(s => ({ ...s, fromEmail: v }))} type="email" /></Field>
              <Field label="From Name"><Input value={emailSettings.fromName} onChange={(v) => setEmailSettings(s => ({ ...s, fromName: v }))} /></Field>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setEmailSettings(s => ({ ...s, sendConfirmation: !s.sendConfirmation }))}
                className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
                style={{ background: emailSettings.sendConfirmation ? '#10984B' : '#374151' }}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${emailSettings.sendConfirmation ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm font-semibold text-admin-foreground">Send order confirmation emails to customers</span>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications" icon={<Bell size={18} />}>
            <div className="space-y-3">
              {[
                { label: 'New order received', sub: 'Play sound and show banner when a new paid order arrives' },
                { label: 'EPOS failure alert', sub: 'Alert when an order fails to reach EPOS' },
                { label: 'Payment failure alert', sub: 'Alert when a customer payment fails' },
                { label: 'Low stock alerts', sub: 'Alert when menu items are marked unavailable' },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <div>
                    <p className="text-sm font-bold text-admin-foreground">{n.label}</p>
                    <p className="text-xs text-admin-muted mt-0.5">{n.sub}</p>
                  </div>
                  <button className="w-10 h-5 rounded-full relative flex-shrink-0" style={{ background: '#10984B' }}>
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </AdminLayout>
  );
}
