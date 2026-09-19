'use client';

import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

// Backend integration: Replace this entire component with Stripe Payment Element
// <PaymentElement /> from @stripe/react-stripe-js
// Wrap with <Elements stripe={stripePromise} options={{ clientSecret }}>

export default function StripePaymentMock() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <div>
      {/* Card type icons */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5">
          <span className="text-xs font-bold text-blue-700">VISA</span>
        </div>
        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5">
          <span className="text-xs font-bold text-red-600">MC</span>
        </div>
        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5">
          <span className="text-xs font-bold text-blue-900">AMEX</span>
        </div>
        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5">
          <span className="text-xs font-semibold text-foreground">🍎 Pay</span>
        </div>
        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5">
          <span className="text-xs font-semibold text-foreground">G Pay</span>
        </div>
      </div>

      {/* Mock Stripe Payment Element UI */}
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary/2">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Card Details</span>
          <span className="ml-auto text-xs text-muted-foreground bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Test Mode</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="stripe-input-mock"
              maxLength={19}
              aria-label="Card number"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Expiry</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="stripe-input-mock"
                maxLength={5}
                aria-label="Card expiry"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">CVC</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="stripe-input-mock"
                maxLength={4}
                aria-label="Card CVC"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Test card: 4242 4242 4242 4242 · Any future date · Any CVC
        </p>
      </div>
    </div>
  );
}