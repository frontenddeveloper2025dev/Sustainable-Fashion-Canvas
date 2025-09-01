import React, { useState } from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity?: number;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedColor,
  selectedSize,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true
}) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Selection Required",
        description: "Please select a color and size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem(product, selectedColor, selectedSize, quantity);
    
    setIsAdding(false);
    setJustAdded(true);
    
    // Show success feedback
    toast({
      title: "Added to Cart! 🌱",
      description: `${product.name} in ${selectedColor}, size ${selectedSize} has been added to your sustainable cart.`,
      duration: 3000
    });
    
    // Reset the "just added" state after animation
    setTimeout(() => setJustAdded(false), 2000);
  };

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          Adding...
        </>
      );
    }
    
    if (justAdded) {
      return (
        <>
          {showIcon && <Check className="h-4 w-4" />}
          Added!
        </>
      );
    }
    
    return (
      <>
        {showIcon && <ShoppingCart className="h-4 w-4" />}
        Add to Cart
      </>
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`transition-all duration-200 ${
        justAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : variant === 'default' 
            ? 'bg-sage-600 hover:bg-sage-700 text-white' 
            : ''
      } ${className}`}
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <div className="flex items-center gap-2">
        {getButtonContent()}
      </div>
    </Button>
  );
};

// Quick Add to Cart Component for product cards
interface QuickAddToCartProps {
  product: Product;
  className?: string;
}

export const QuickAddToCart: React.FC<QuickAddToCartProps> = ({ 
  product, 
  className = '' 
}) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use first available color and size as defaults
    const defaultColor = product.colors[0]?.name || 'Default';
    const defaultSize = product.sizes[0] || 'M';
    
    setIsAdding(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    addItem(product, defaultColor, defaultSize, 1);
    
    setIsAdding(false);
    
    toast({
      title: "Quick Added! 🌱",
      description: `${product.name} (${defaultColor}, ${defaultSize}) added to cart. You can adjust details in your cart.`,
      duration: 3000
    });
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-sage-700 border border-sage-200 ${className}`}
      onClick={handleQuickAdd}
      disabled={isAdding}
    >
      {isAdding ? (
        <div className="animate-spin rounded-full h-3 w-3 border-2 border-sage-600 border-t-transparent" />
      ) : (
        <Plus className="h-3 w-3" />
      )}
    </Button>
  );
};