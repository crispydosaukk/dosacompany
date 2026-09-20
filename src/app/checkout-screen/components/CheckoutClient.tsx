'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Shield, Lock, CheckCircle2, AlertCircle, Loader2, LayoutDashboard } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/menuData';
import { CartItem, getCartSubtotal, getCartVAT, getCartTotal } from '@/lib/cartStore';
import StripePaymentMock from './StripePaymentMock';
import OrderSummarySection from './OrderSummarySection';

// Mock cart data for demonstration
// Backend integration: cart state should be passed via context or URL params
const MOCK_CART: CartItem[] = [
  {
    cartItemId: 'cart-item-001',
    menuItemId: 'item-masala-dosa',
    name: 'Masala Dosa',
    basePrice: 775,
    quantity: 2,
    modifiers: [
      { groupId: 'mg-dosa-chutney', groupLabel: 'Choose Chutney', optionId: 'opt-both', optionLabel: 'Both Chutneys', extraPrice: 0 },
      { groupId: 'mg-dosa-extras', groupLabel: 'Extras', optionId: 'opt-extra-sambar', optionLabel: 'Extra Sambar', extraPrice: 100 },
    ],
    specialInstructions: 'Extra crispy please',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80',
  },
  {
    cartItemId: 'cart-item-002',
    menuItemId: 'item-gobi-65',
    name: 'Gobi 65',
    basePrice: 899,
    quantity: 1,
    modifiers: [],
    specialInstructions: '',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80',
  },
  {
    cartItemId: 'cart-item-003',
    menuItemId: 'item-mango-lassi',
    name: 'Mango Lassi',
    basePrice: 450,
    quantity: 2,
    modifiers: [],
    specialInstructions: '',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80',
  },
];

type CheckoutFormValues = {
  fullName: string;
  whatsappNumber: string;
  email: string;
  orderNote: string;
};

type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

export default function CheckoutClient() {
  const router = useRouter();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentError, setPaymentError] = useState('');
  const TABLE_NUMBER = 1; // Backend integration: from QR session token

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormValues>({
    defaultValues: { fullName: '', whatsappNumber: '', email: '', orderNote: '' },
  });

  const subtotal = getCartSubtotal(MOCK_CART);
  const vat = getCartVAT(subtotal);
  const total = getCartTotal(MOCK_CART);

  const onSubmit = async (data: CheckoutFormValues) => {
    setPaymentState('processing');
    setPaymentError('');
    // Backend integration: POST /api/payments/create with cart items + customer details
    // Server recalculates prices from DB, creates Stripe PaymentIntent, returns clientSecret
    // Then use Stripe.js to confirm payment with clientSecret
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Simulate success 85% of the time
    if (Math.random() > 0.15) {
      setPaymentState('success');
      setTimeout(() => {
        router.push('/order-confirmation-screen');
      }, 1200);
    } else {
      setPaymentState('failed');
      setPaymentError('Payment could not be completed. Please check your card details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-muted hover:bg-border flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <AppLogo size={32} />
            <div>
              <div className="font-bold text-foreground text-sm leading-tight">Checkout</div>
              <div className="text-xs text-muted-foreground">Table {TABLE_NUMBER} · Dosa Company</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin-dashboard"
              id="checkout-admin-dashboard-link"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-150 shadow-sm active:scale-95 border border-neutral-700/60"
              title="Access Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <LayoutDashboard size={14} className="text-secondary" />
              <span>Admin</span>
            </Link>
            <div className="flex items-center gap-1.5 text-secondary">
              <Lock size={14} />
              <span className="text-xs font-semibold">Secure</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {paymentState === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-2">Sending your order to the restaurant...</p>
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Table info */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {TABLE_NUMBER}
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">Table {TABLE_NUMBER}</div>
                <div className="text-xs text-muted-foreground">Your order will be sent directly to the kitchen</div>
              </div>
            </div>

            {/* Order Summary */}
            <OrderSummarySection cartItems={MOCK_CART} subtotal={subtotal} vat={vat} total={total} />

            {/* Customer Details */}
            <div className="bg-white rounded-2xl border border-border p-5 mb-4">
              <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="fullName">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Priya Sharma"
                    className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
                    {...register('fullName', {
                      required: 'Please enter your full name',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="whatsappNumber">
                    WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-1.5">UK or international format (e.g. +447700123456)</p>
                  <input
                    id="whatsappNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+447700123456"
                    className={`form-input ${errors.whatsappNumber ? 'form-input-error' : ''}`}
                    {...register('whatsappNumber', {
                      required: 'Please enter your WhatsApp number',
                      pattern: {
                        value: /^\+?[0-9\s\-()]{7,20}$/,
                        message: 'Please enter a valid phone number',
                      },
                    })}
                  />
                  {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1.5">{errors.whatsappNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="email">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-1.5">Your order confirmation will be sent here</p>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="priya@example.com"
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    {...register('email', {
                      required: 'Please enter your email address',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="orderNote">
                    Order Note <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="orderNote"
                    rows={2}
                    placeholder="Any special requests for the kitchen..."
                    className="form-input resize-none"
                    {...register('orderNote')}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-border p-5 mb-4">
              <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                Payment
              </h2>
              <StripePaymentMock />
            </div>

            {/* Payment error */}
            {paymentState === 'failed' && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-semibold text-sm">Payment failed</p>
                  <p className="text-red-600 text-sm mt-0.5">{paymentError}</p>
                  <p className="text-red-500 text-xs mt-1">Your cart has been saved. Please try again.</p>
                </div>
              </div>
            )}

            {/* Pay button */}
            <button
              type="submit"
              disabled={paymentState === 'processing'}
              className="btn-primary text-lg py-4"
            >
              {paymentState === 'processing' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Processing payment...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pay {formatPrice(total)}
                </>
              )}
            </button>

            {paymentState === 'processing' && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Please do not close this page while your payment is being processed.
              </p>
            )}

            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield size={14} />
                <span className="text-xs">256-bit SSL</span>
              </div>
              <div className="w-1 h-1 bg-border rounded-full" />
              <span className="text-xs text-muted-foreground">Powered by Stripe</span>
              <div className="w-1 h-1 bg-border rounded-full" />
              <span className="text-xs text-muted-foreground">Visa · Mastercard · Apple Pay</span>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}