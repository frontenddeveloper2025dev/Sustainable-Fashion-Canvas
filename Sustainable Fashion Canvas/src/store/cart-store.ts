import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface SustainabilityImpact {
  totalWaterSaved: number; // in liters
  totalCO2Reduced: number; // in kg
  totalRecycledMaterials: number; // percentage
  itemsWithCertifications: number;
  totalCertifications: string[];
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  sustainabilityImpact: SustainabilityImpact;
  addItem: (product: Product, color: string, size: string, quantity?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  calculateSustainabilityImpact: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const calculateImpactFromItems = (items: CartItem[]): SustainabilityImpact => {
  let totalWaterSaved = 0;
  let totalCO2Reduced = 0;
  let totalRecycledMaterials = 0;
  let itemsWithCertifications = 0;
  const allCertifications = new Set<string>();

  items.forEach(item => {
    const { product, quantity } = item;
    
    // Parse water saved (remove 'L' and convert to number)
    const waterSaved = parseFloat(product.impact.waterSaved.replace(/[^\d.]/g, '')) || 0;
    totalWaterSaved += waterSaved * quantity;
    
    // Parse CO2 reduced (remove 'kg' and convert to number)
    const co2Reduced = parseFloat(product.impact.co2Reduced.replace(/[^\d.]/g, '')) || 0;
    totalCO2Reduced += co2Reduced * quantity;
    
    // Parse recycled materials percentage
    const recycledPercent = parseFloat(product.impact.recycledMaterials.replace('%', '')) || 0;
    totalRecycledMaterials += recycledPercent * quantity;
    
    // Count items with certifications
    if (product.certifications.length > 0) {
      itemsWithCertifications += quantity;
      product.certifications.forEach(cert => allCertifications.add(cert));
    }
  });

  // Calculate average recycled materials percentage
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const avgRecycledMaterials = totalQuantity > 0 ? totalRecycledMaterials / totalQuantity : 0;

  return {
    totalWaterSaved: Math.round(totalWaterSaved),
    totalCO2Reduced: Math.round(totalCO2Reduced * 10) / 10, // Round to 1 decimal
    totalRecycledMaterials: Math.round(avgRecycledMaterials),
    itemsWithCertifications,
    totalCertifications: Array.from(allCertifications)
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      sustainabilityImpact: {
        totalWaterSaved: 0,
        totalCO2Reduced: 0,
        totalRecycledMaterials: 0,
        itemsWithCertifications: 0,
        totalCertifications: []
      },

      addItem: (product, color, size, quantity = 1) => {
        set(state => {
          const existingItemIndex = state.items.findIndex(
            item => 
              item.product.id === product.id && 
              item.selectedColor === color && 
              item.selectedSize === size
          );

          let newItems;
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            newItems = [
              ...state.items,
              { product, quantity, selectedColor: color, selectedSize: size }
            ];
          }

          return {
            items: newItems,
            sustainabilityImpact: calculateImpactFromItems(newItems)
          };
        });
      },

      removeItem: (productId, color, size) => {
        set(state => {
          const newItems = state.items.filter(
            item => !(
              item.product.id === productId && 
              item.selectedColor === color && 
              item.selectedSize === size
            )
          );

          return {
            items: newItems,
            sustainabilityImpact: calculateImpactFromItems(newItems)
          };
        });
      },

      updateQuantity: (productId, color, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        set(state => {
          const newItems = state.items.map(item => {
            if (
              item.product.id === productId && 
              item.selectedColor === color && 
              item.selectedSize === size
            ) {
              return { ...item, quantity };
            }
            return item;
          });

          return {
            items: newItems,
            sustainabilityImpact: calculateImpactFromItems(newItems)
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          sustainabilityImpact: {
            totalWaterSaved: 0,
            totalCO2Reduced: 0,
            totalRecycledMaterials: 0,
            itemsWithCertifications: 0,
            totalCertifications: []
          }
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      calculateSustainabilityImpact: () => {
        set(state => ({
          sustainabilityImpact: calculateImpactFromItems(state.items)
        }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'ecofashion-cart',
      version: 1
    }
  )
);