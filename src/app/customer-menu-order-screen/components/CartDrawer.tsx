'use client';

import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { CartItem, getItemTotal, getCartSubtotal, getCartVAT, getCartTotal } from '@/lib/cartStore';
import { formatPrice } from '@/lib/menuData';

interface Props {
  cartItems: CartItem[];
  tableNumber: number;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ cartItems, tableNumber, onClose, onUpdateQuantity, onRemoveItem, onCheckout }: Props) {
  const subtotal = getCartSubtotal(cartItems);
  const vat = getCartVAT(subtotal);
  const total = getCartTotal(cartItems);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet max-h-[88vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Order</h2>
            <p className="text-sm text-muted-foreground">Table {tableNumber}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-colors" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <ShoppingBag size={48} className="text-muted-foreground mb-4" />
            <h3 className="font-bold text-foreground text-lg mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm text-center">Browse the menu and add items to get started</p>
            <button onClick={onClose} className="mt-6 btn-primary w-auto px-8">Browse Menu</button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3" style={{ maxHeight: 'calc(88vh - 280px)' }}>
              {cartItems.map((item) => (
                <div key={`cart-row-${item.cartItemId}`} className="flex gap-3 py-3 border-b border-border last:border-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <AppImage src={item.image} alt={`${item.name} in cart`} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-foreground text-sm leading-tight">{item.name}</h4>
                      <button onClick={() => onRemoveItem(item.cartItemId)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0" aria-label="Remove item">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {item.modifiers.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.modifiers.map((m) => m.optionLabel).join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-xs text-secondary mt-0.5 italic">"{item.specialInstructions}"</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onUpdateQuantity(item.cartItemId, -1)} className="w-7 h-7 rounded-lg border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors" aria-label="Decrease">
                          <Minus size={13} />
                        </button>
                        <span className="font-bold text-sm font-mono-nums w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.cartItemId, 1)} className="w-7 h-7 rounded-lg border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors" aria-label="Increase">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-bold text-foreground text-sm font-mono-nums">{formatPrice(getItemTotal(item))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 pt-3 pb-2 border-t border-border">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium font-mono-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (20%)</span>
                  <span className="font-medium font-mono-nums">{formatPrice(vat)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary font-mono-nums">{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={onCheckout} className="btn-primary">
                Continue to Checkout
                <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs text-muted-foreground mt-2">Secure payment powered by Stripe</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}