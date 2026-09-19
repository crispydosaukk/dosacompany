'use client';

import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { MenuItem, ModifierGroup, formatPrice } from '@/lib/menuData';
import { CartModifier } from '@/lib/cartStore';

interface Props {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, modifiers: CartModifier[], specialInstructions: string, qty: number) => void;
}

export default function ItemCustomisationModal({ item, onClose, onAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleOption = (group: ModifierGroup, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[group.id] || [];
      if (group.multiSelect) {
        return {
          ...prev,
          [group.id]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      } else {
        return { ...prev, [group.id]: [optionId] };
      }
    });
    setErrors((prev) => ({ ...prev, [group.id]: '' }));
  };

  const modifierTotal = useMemo(() => {
    let total = 0;
    for (const group of item.modifierGroups) {
      const selected = selectedOptions[group.id] || [];
      for (const optId of selected) {
        const opt = group.options.find((o) => o.id === optId);
        if (opt) total += opt.extraPrice;
      }
    }
    return total;
  }, [selectedOptions, item.modifierGroups]);

  const itemUnitPrice = item.price + modifierTotal;
  const totalPrice = itemUnitPrice * quantity;

  const handleAddToCart = () => {
    const newErrors: Record<string, string> = {};
    for (const group of item.modifierGroups) {
      if (group.required && (!selectedOptions[group.id] || selectedOptions[group.id].length === 0)) {
        newErrors[group.id] = `Please choose a ${group.label.toLowerCase()}`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const modifiers: CartModifier[] = [];
    for (const group of item.modifierGroups) {
      const selected = selectedOptions[group.id] || [];
      for (const optId of selected) {
        const opt = group.options.find((o) => o.id === optId);
        if (opt) {
          modifiers.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: opt.id,
            optionLabel: opt.label,
            extraPrice: opt.extraPrice,
          });
        }
      }
    }
    onAddToCart(item, modifiers, specialInstructions, quantity);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Image */}
        <div className="relative h-52 mx-0">
          <AppImage
            src={item.image}
            alt={`${item.name} - ${item.description.slice(0, 80)}`}
            fill
            className="object-cover"
            sizes="540px"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              🌿 100% Vegetarian
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Item info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground mb-1">{item.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            {item.allergens.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Contains: {item.allergens.join(', ')}
              </p>
            )}
          </div>

          {/* Modifier groups */}
          {item.modifierGroups.map((group) => (
            <div key={`mg-${group.id}`} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground text-sm">{group.label}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${group.required ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {group.required ? 'Required' : 'Optional'}
                </span>
              </div>
              {errors[group.id] && (
                <p className="text-xs text-red-500 mb-2">{errors[group.id]}</p>
              )}
              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isSelected = (selectedOptions[group.id] || []).includes(opt.id);
                  return (
                    <button
                      key={`opt-${opt.id}`}
                      onClick={() => toggleOption(group, opt.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-primary bg-primary/5' :'border-border bg-white hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="font-medium text-foreground text-sm">{opt.label}</span>
                      </div>
                      {opt.extraPrice > 0 && (
                        <span className="text-secondary font-semibold text-sm font-mono-nums">+{formatPrice(opt.extraPrice)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special instructions */}
          <div className="mb-5">
            <label className="block font-bold text-foreground text-sm mb-2">
              Special Instructions <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 250))}
              placeholder="e.g. No onions, extra crispy, mild spice..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{specialInstructions.length}/250</p>
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="qty-btn"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-foreground text-xl w-6 text-center font-mono-nums">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="qty-btn"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
            >
              <ShoppingCart size={18} />
              Add to Cart · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}