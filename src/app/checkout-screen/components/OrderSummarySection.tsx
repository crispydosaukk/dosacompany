'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem, getItemTotal } from '@/lib/cartStore';
import { formatPrice } from '@/lib/menuData';

interface Props {
  cartItems: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
}

export default function OrderSummarySection({ cartItems, subtotal, vat, total }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-border p-5 mb-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
          <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">1</span>
          Order Summary
          <span className="text-sm font-normal text-muted-foreground">({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
        </h2>
        {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {cartItems.map((item) => (
            <div key={`summary-${item.cartItemId}`} className="flex justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {item.quantity}× {item.name}
                </p>
                {item.modifiers.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.modifiers.map((m) => m.optionLabel).join(', ')}
                    {item.modifiers.some((m) => m.extraPrice > 0) && (
                      <span className="text-secondary ml-1">
                        (+{formatPrice(item.modifiers.reduce((s, m) => s + m.extraPrice, 0))})
                      </span>
                    )}
                  </p>
                )}
                {item.specialInstructions && (
                  <p className="text-xs text-secondary/70 italic mt-0.5">"{item.specialInstructions}"</p>
                )}
              </div>
              <span className="font-semibold text-foreground text-sm font-mono-nums flex-shrink-0">{formatPrice(getItemTotal(item))}</span>
            </div>
          ))}

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium font-mono-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (20%)</span>
              <span className="font-medium font-mono-nums">{formatPrice(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span className="text-foreground">Total</span>
              <span className="text-primary font-mono-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}