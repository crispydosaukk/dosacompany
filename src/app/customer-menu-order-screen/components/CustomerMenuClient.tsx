'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Search, ShoppingCart, ChevronRight, X, Plus, Info, LayoutDashboard } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import { MENU_CATEGORIES, MENU_ITEMS, MenuItem, formatPrice } from '@/lib/menuData';
import { CartItem, CartModifier, getCartTotal } from '@/lib/cartStore';
import ItemCustomisationModal from './ItemCustomisationModal';
import CartDrawer from './CartDrawer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TABLE_NUMBER = 1; // Backend integration: resolve from QR token /order/t/{token}

export default function CustomerMenuClient() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsByCategory = MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({
    category: cat,
    items: filteredItems.filter((i) => i.categoryId === cat.id),
  })).filter((group) => group.items.length > 0);

  const addToCart = useCallback((item: MenuItem, modifiers: CartModifier[], specialInstructions: string, qty: number) => {
    const cartItemId = `cart-${item.id}-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        cartItemId,
        menuItemId: item.id,
        name: item.name,
        basePrice: item.price,
        quantity: qty,
        modifiers,
        specialInstructions,
        image: item.image,
      },
    ]);
    setSelectedItem(null);
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.cartItemId === cartItemId ? { ...ci, quantity: Math.max(1, ci.quantity + delta) } : ci
      )
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = getCartTotal(cartItems);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const el = categoryRefs.current[categoryId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToCheckout = () => {
    router.push('/checkout-screen');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <AppLogo size={36} />
                <div>
                  <div className="font-bold text-foreground text-base leading-tight">Dosa Company</div>
                  <div className="text-xs text-secondary font-semibold">Table {TABLE_NUMBER}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin-dashboard"
                id="navbar-admin-dashboard-link"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-150 shadow-sm active:scale-95 border border-neutral-700/60"
                title="Access Admin Dashboard"
                aria-label="Admin Dashboard"
              >
                <LayoutDashboard size={15} className="text-secondary" />
                <span>Admin</span>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 font-semibold text-sm transition-all duration-150 hover:bg-red-700 active:scale-95"
                aria-label="View cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {cartCount > 0 ? (
                  <span>{formatPrice(cartTotal)}</span>
                ) : (
                  <span>Cart</span>
                )}
              </button>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-input rounded-xl text-sm border border-border focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Nav */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={`cat-pill-${cat.id}`}
                onClick={() => {
                  if (cat.id === 'all') {
                    setActiveCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    scrollToCategory(cat.id);
                  }
                }}
                className={`category-pill ${activeCategory === cat.id ? 'category-pill-active' : 'category-pill-inactive'}`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {/* Table banner */}
        <div className="bg-gradient-to-r from-primary/8 to-secondary/8 border border-primary/20 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {TABLE_NUMBER}
          </div>
          <div>
            <div className="font-bold text-foreground text-sm">Table {TABLE_NUMBER}</div>
            <div className="text-xs text-muted-foreground">Order directly from your table · 100% Vegetarian</div>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="veg-indicator" />
              Veg
            </span>
          </div>
        </div>

        {/* Featured items */}
        {activeCategory === 'all' && searchQuery === '' && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">⭐ Chef's Favourites</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {MENU_ITEMS.filter((i) => i.featured && i.available).map((item) => (
                <FeaturedCard key={`featured-${item.id}`} item={item} onAdd={() => {
                  if (item.modifierGroups.length > 0) {
                    setSelectedItem(item);
                  } else {
                    addToCart(item, [], '', 1);
                  }
                }} />
              ))}
            </div>
          </section>
        )}

        {/* Menu sections */}
        {activeCategory === 'all' ? (
          itemsByCategory.map(({ category, items }) => (
            <section
              key={`section-${category.id}`}
              ref={(el) => { categoryRefs.current[category.id] = el; }}
              className="mb-10"
            >
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.name}
                <span className="text-sm font-normal text-muted-foreground ml-1">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <MenuItemCard
                    key={`menuitem-${item.id}`}
                    item={item}
                    onAdd={() => {
                      if (item.modifierGroups.length > 0) {
                        setSelectedItem(item);
                      } else {
                        addToCart(item, [], '', 1);
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={`filtered-${item.id}`}
                item={item}
                onAdd={() => {
                  if (item.modifierGroups.length > 0) {
                    setSelectedItem(item);
                  } else {
                    addToCart(item, [], '', 1);
                  }
                }}
              />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-foreground mb-1">No items found</h3>
            <p className="text-muted-foreground text-sm">Try a different search or category</p>
          </div>
        )}
      </main>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="sticky-cart-bar px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-2xl mx-auto flex items-center justify-between bg-primary text-white rounded-2xl px-5 py-4 font-bold shadow-xl transition-all duration-150 hover:bg-red-700 active:scale-98 block"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 rounded-lg px-2.5 py-1 text-sm font-bold">{cartCount}</span>
              <span className="text-base">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono-nums">{formatPrice(cartTotal)}</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedItem && (
        <ItemCustomisationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          tableNumber={TABLE_NUMBER}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={goToCheckout}
        />
      )}
    </div>
  );
}

function FeaturedCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <div className="flex-shrink-0 w-48 food-card cursor-pointer" onClick={onAdd}>
      <div className="relative h-28 overflow-hidden">
        <AppImage
          src={item.image}
          alt={`${item.name} - South Indian dish`}
          fill
          className="object-cover"
          sizes="192px"
        />
        <div className="absolute top-2 left-2">
          <span className="veg-indicator" />
        </div>
        {item.spiceLevel !== 'none' && (
          <div className="absolute top-2 right-2">
            <SpiceBadge level={item.spiceLevel} />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="font-bold text-foreground text-sm leading-tight mb-1 truncate">{item.name}</div>
        <div className="text-primary font-bold text-sm font-mono-nums">{formatPrice(item.price)}</div>
      </div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <div className={`food-card ${!item.available ? 'opacity-60' : ''}`}>
      <div className="relative h-44 overflow-hidden">
        <AppImage
          src={item.image}
          alt={`${item.name} - ${item.description.slice(0, 60)}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="veg-indicator" />
        </div>
        {item.spiceLevel !== 'none' && (
          <div className="absolute top-3 right-3">
            <SpiceBadge level={item.spiceLevel} />
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Currently unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-foreground text-base leading-tight">{item.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2 line-clamp-2">{item.description}</p>
        {item.allergens.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Info size={11} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground capitalize">{item.allergens.join(', ')}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg font-mono-nums">{formatPrice(item.price)}</span>
          {item.available ? (
            <button onClick={onAdd} className="add-btn">
              <Plus size={16} />
              Add
            </button>
          ) : (
            <span className="text-muted-foreground text-sm font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SpiceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    mild: 'bg-yellow-100 text-yellow-700',
    medium: 'bg-orange-100 text-orange-700',
    hot: 'bg-red-100 text-red-700',
  };
  const flames: Record<string, string> = { mild: '🌶', medium: '🌶🌶', hot: '🌶🌶🌶' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[level] || ''}`}>
      {flames[level]}
    </span>
  );
}