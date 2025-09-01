import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  variant = 'ghost',
  size = 'default',
  className
}) => {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const { toast } = useToast();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeItem(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addItem(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      className={`transition-colors ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} 
      />
      {size !== 'sm' && (
        <span className="ml-2">
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
};