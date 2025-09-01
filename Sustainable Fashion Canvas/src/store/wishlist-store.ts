import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface WishlistItem {
  product: Product;
  dateAdded: string;
  notes?: string;
}

export interface SustainabilityComparison {
  products: Product[];
  bestWaterSaver: Product | null;
  bestCO2Reducer: Product | null;
  mostRecycled: Product | null;
  mostCertifications: Product | null;
  sustainabilityScores: { [productId: string]: number };
  averageImpact: {
    waterSaved: number;
    co2Reduced: number;
    recycledMaterials: number;
  };
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  comparisonMode: boolean;
  selectedForComparison: string[];
  addItem: (product: Product, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearWishlist: () => void;
  toggleWishlist: () => void;
  toggleComparisonMode: () => void;
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  getComparison: () => SustainabilityComparison;
  isInWishlist: (productId: string) => boolean;
  isInComparison: (productId: string) => boolean;
  getTotalItems: () => number;
}

const calculateSustainabilityScore = (product: Product): number => {
  // Parse impact values
  const waterSaved = parseFloat(product.impact.waterSaved.replace(/[^\d.]/g, '')) || 0;
  const co2Reduced = parseFloat(product.impact.co2Reduced.replace(/[^\d.]/g, '')) || 0;
  const recycledPercent = parseFloat(product.impact.recycledMaterials.replace('%', '')) || 0;
  
  // Normalize values (these are rough estimates for scoring)
  const waterScore = Math.min(waterSaved / 10000, 1) * 30; // Max 30 points
  const co2Score = Math.min(co2Reduced / 20, 1) * 30; // Max 30 points
  const recycledScore = (recycledPercent / 100) * 25; // Max 25 points
  const certificationScore = Math.min(product.certifications.length * 3, 15); // Max 15 points
  
  return Math.round(waterScore + co2Score + recycledScore + certificationScore);
};

const generateComparison = (products: Product[]): SustainabilityComparison => {
  if (products.length === 0) {
    return {
      products: [],
      bestWaterSaver: null,
      bestCO2Reducer: null,
      mostRecycled: null,
      mostCertifications: null,
      sustainabilityScores: {},
      averageImpact: { waterSaved: 0, co2Reduced: 0, recycledMaterials: 0 }
    };
  }

  const sustainabilityScores: { [productId: string]: number } = {};
  let bestWaterSaver = products[0];
  let bestCO2Reducer = products[0];
  let mostRecycled = products[0];
  let mostCertifications = products[0];
  
  let totalWater = 0;
  let totalCO2 = 0;
  let totalRecycled = 0;

  products.forEach(product => {
    // Calculate sustainability score
    sustainabilityScores[product.id] = calculateSustainabilityScore(product);
    
    // Parse values for comparison
    const waterSaved = parseFloat(product.impact.waterSaved.replace(/[^\d.]/g, '')) || 0;
    const co2Reduced = parseFloat(product.impact.co2Reduced.replace(/[^\d.]/g, '')) || 0;
    const recycledPercent = parseFloat(product.impact.recycledMaterials.replace('%', '')) || 0;
    
    totalWater += waterSaved;
    totalCO2 += co2Reduced;
    totalRecycled += recycledPercent;
    
    // Find best performers
    if (waterSaved > parseFloat(bestWaterSaver.impact.waterSaved.replace(/[^\d.]/g, '') || '0')) {
      bestWaterSaver = product;
    }
    if (co2Reduced > parseFloat(bestCO2Reducer.impact.co2Reduced.replace(/[^\d.]/g, '') || '0')) {
      bestCO2Reducer = product;
    }
    if (recycledPercent > parseFloat(mostRecycled.impact.recycledMaterials.replace('%', '') || '0')) {
      mostRecycled = product;
    }
    if (product.certifications.length > mostCertifications.certifications.length) {
      mostCertifications = product;
    }
  });

  return {
    products,
    bestWaterSaver,
    bestCO2Reducer,
    mostRecycled,
    mostCertifications,
    sustainabilityScores,
    averageImpact: {
      waterSaved: Math.round(totalWater / products.length),
      co2Reduced: Math.round((totalCO2 / products.length) * 10) / 10,
      recycledMaterials: Math.round(totalRecycled / products.length)
    }
  };
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      comparisonMode: false,
      selectedForComparison: [],

      addItem: (product, notes) => {
        set(state => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          if (existingItem) {
            return state; // Don't add duplicates
          }

          return {
            items: [
              ...state.items,
              {
                product,
                dateAdded: new Date().toISOString(),
                notes
              }
            ]
          };
        });
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
          selectedForComparison: state.selectedForComparison.filter(id => id !== productId)
        }));
      },

      updateNotes: (productId, notes) => {
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, notes } : item
          )
        }));
      },

      clearWishlist: () => {
        set({
          items: [],
          selectedForComparison: []
        });
      },

      toggleWishlist: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      toggleComparisonMode: () => {
        set(state => ({ 
          comparisonMode: !state.comparisonMode,
          selectedForComparison: !state.comparisonMode ? [] : state.selectedForComparison
        }));
      },

      addToComparison: (productId) => {
        set(state => {
          if (state.selectedForComparison.includes(productId) || state.selectedForComparison.length >= 4) {
            return state; // Don't add duplicates or exceed limit
          }
          return {
            selectedForComparison: [...state.selectedForComparison, productId]
          };
        });
      },

      removeFromComparison: (productId) => {
        set(state => ({
          selectedForComparison: state.selectedForComparison.filter(id => id !== productId)
        }));
      },

      clearComparison: () => {
        set({ selectedForComparison: [] });
      },

      getComparison: () => {
        const state = get();
        const selectedProducts = state.items
          .filter(item => state.selectedForComparison.includes(item.product.id))
          .map(item => item.product);
        
        return generateComparison(selectedProducts);
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId);
      },

      isInComparison: (productId) => {
        return get().selectedForComparison.includes(productId);
      },

      getTotalItems: () => {
        return get().items.length;
      }
    }),
    {
      name: 'ecofashion-wishlist',
      version: 1
    }
  )
);