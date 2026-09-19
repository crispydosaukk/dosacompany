'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ChefHat, Utensils, RotateCcw, Copy, Check } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/menuData';
import { toast } from 'sonner';

const ORDER_NUMBER = 'DC-20260919-000247';
const TABLE_NUMBER = 1;
const ORDER_TOTAL = 3573; // pence
const CUSTOMER_NAME = 'Priya Sharma';

const ORDER_ITEMS = [
  {
    id: 'oi-001',
    name: 'Masala Dosa',
    quantity: 2,
    unitPrice: 875,
    modifiers: ['Both Chutneys', 'Extra Sambar (+£1.00)'],
  },
  {
    id: 'oi-002',
    name: 'Gobi 65',
    quantity: 1,
    unitPrice: 899,
    modifiers: [],
  },
  {
    id: 'oi-003',
    name: 'Mango Lassi',
    quantity: 2,
    unitPrice: 450,
    modifiers: [],
  },
];

type StepStatus = 'completed' | 'active' | 'pending';

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  status: StepStatus;
  time?: string;
}

export default function OrderConfirmationClient() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [kitchenStatus, setKitchenStatus] = useState<'sending' | 'sent' | 'preparing'>('sending');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${h}:${m}`);

    const t1 = setTimeout(() => setKitchenStatus('sent'), 1800);
    const t2 = setTimeout(() => setKitchenStatus('preparing'), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(ORDER_NUMBER).then(() => {
      setCopied(true);
      toast.success('Order number copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps: TimelineStep[] = [
    {
      id: 'step-placed',
      label: 'Order Placed',
      description: 'Your order has been received',
      icon: <CheckCircle2 size={18} />,
      status: 'completed',
      time: currentTime,
    },
    {
      id: 'step-paid',
      label: 'Payment Confirmed',
      description: 'Stripe payment verified · ' + formatPrice(ORDER_TOTAL),
      icon: <CheckCircle2 size={18} />,
      status: 'completed',
      time: currentTime,
    },
    {
      id: 'step-epos',
      label: 'Sent to Restaurant',
      description: 'EPOS system accepted your order',
      icon: <CheckCircle2 size={18} />,
      status: 'completed',
      time: currentTime,
    },
    {
      id: 'step-kitchen',
      label: 'Kitchen Preparing',
      description: kitchenStatus === 'sending' ?'Sending to kitchen...'
        : kitchenStatus === 'sent' ?'Kitchen has received your order' :'Your food is being prepared now',
      icon: kitchenStatus === 'sending'
        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        : <ChefHat size={18} />,
      status: kitchenStatus === 'sending' ? 'active' : 'completed',
      time: kitchenStatus !== 'sending' ? currentTime : undefined,
    },
    {
      id: 'step-ready',
      label: 'Ready to Serve',
      description: 'Your food will be brought to Table ' + TABLE_NUMBER,
      icon: <Utensils size={18} />,
      status: 'pending',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <AppLogo size={32} />
          <div>
            <div className="font-bold text-foreground text-sm">Dosa Company</div>
            <div className="text-xs text-muted-foreground">Order Confirmation</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 animate-fade-in">
        {/* Hero confirmation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center pulse-ring">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={44} className="text-secondary" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Order Confirmed! 🎉</h1>
          <p className="text-muted-foreground text-base">
            Thank you, {CUSTOMER_NAME.split(' ')[0]}! Your food is on its way to the kitchen.
          </p>
        </div>

        {/* Order number card */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-base">Order Details</h2>
            <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              PAID
            </span>
          </div>

          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Order Number</p>
              <p className="font-mono font-bold text-foreground text-lg tracking-wider">{ORDER_NUMBER}</p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="w-9 h-9 bg-white border border-border rounded-xl flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Copy order number"
            >
              {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} className="text-muted-foreground" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">Table</p>
              <p className="font-bold text-foreground text-base">{TABLE_NUMBER}</p>
            </div>
            <div className="bg-muted rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">Total Paid</p>
              <p className="font-bold text-primary text-base font-mono-nums">{formatPrice(ORDER_TOTAL)}</p>
            </div>
            <div className="bg-muted rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">Customer</p>
              <p className="font-bold text-foreground text-sm truncate">{CUSTOMER_NAME}</p>
            </div>
            <div className="bg-muted rounded-xl px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">Est. Time</p>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-amber-500" />
                <p className="font-bold text-foreground text-sm">20–30 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <h2 className="font-bold text-foreground text-base mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {ORDER_ITEMS.map((item) => (
              <div key={`confirm-item-${item.id}`} className="flex justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{item.quantity}× {item.name}</p>
                  {item.modifiers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.modifiers.join(' · ')}</p>
                  )}
                </div>
                <span className="font-semibold text-foreground text-sm font-mono-nums flex-shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-6">
          <h2 className="font-bold text-foreground text-base mb-4">Order Status</h2>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-secondary' :
                    step.status === 'active' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {step.status === 'pending' ? (
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    ) : (
                      <span className={step.status === 'active' ? 'text-white' : ''}>{step.icon}</span>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 transition-all duration-500 ${
                      step.status === 'completed' ? 'bg-secondary' : 'bg-border'
                    }`} />
                  )}
                </div>
                <div className="pb-6 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <span className="text-xs text-muted-foreground font-mono-nums flex-shrink-0">{step.time}</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${step.status === 'pending' ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary-outline"
          >
            <RotateCcw size={18} />
            Order More — Table {TABLE_NUMBER}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            A confirmation email has been sent · 100% Vegetarian South Indian cuisine
          </p>
        </div>
      </main>
    </div>
  );
}