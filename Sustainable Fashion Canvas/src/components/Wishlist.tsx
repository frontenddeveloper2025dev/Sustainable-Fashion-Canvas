import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  X, 
  ShoppingCart, 
  GitCompare, 
  Trash2, 
  Edit3,
  Save,
  Plus,
  Minus,
  Droplets,
  Recycle,
  Award
} from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface WishlistProps {
  children: React.ReactNode;
}

export const Wishlist: React.FC<WishlistProps> = ({ children }) => {
  const {
    items,
    isOpen,
    comparisonMode,
    selectedForComparison,
    toggleWishlist,
    removeItem,
    updateNotes,
    toggleComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getTotalItems
  } = useWishlistStore();

  const { addItem: addToCart } = useCartStore();
  const { toast } = useToast();

  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleStartEditNotes = (productId: string, currentNotes?: string) => {
    setEditingNotes(productId);
    setNoteText(currentNotes || '');
  };

  const handleSaveNotes = (productId: string) => {
    updateNotes(productId, noteText);
    setEditingNotes(null);
    setNoteText('');
    toast({
      title: "Notes updated",
      description: "Your product notes have been saved.",
    });
  };

  const handleAddToCart = (productId: string) => {
    const item = items.find(item => item.product.id === productId);
    if (item) {
      const defaultColor = item.product.colors[0]?.name || 'Default';
      const defaultSize = item.product.sizes[0] || 'One Size';
      addToCart(item.product, defaultColor, defaultSize);
      toast({
        title: "Added to cart",
        description: `${item.product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleComparison = (productId: string) => {
    if (isInComparison(productId)) {
      removeFromComparison(productId);
    } else {
      if (selectedForComparison.length >= 4) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 4 items at a time.",
          variant: "destructive"
        });
        return;
      }
      addToComparison(productId);
    }
  };

  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={toggleWishlist}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>My Wishlist</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love to compare their sustainability impact
            </p>
            <Button onClick={toggleWishlist} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={toggleWishlist}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>My Wishlist ({totalItems})</SheetTitle>
            <div className="flex items-center gap-2">
              {selectedForComparison.length > 1 && (
                <Link 
                  to="/wishlist/compare" 
                  onClick={toggleWishlist}
                >
                  <Button size="sm" variant="outline">
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare ({selectedForComparison.length})
                  </Button>
                </Link>
              )}
              <Button
                size="sm"
                variant={comparisonMode ? "default" : "outline"}
                onClick={toggleComparisonMode}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {comparisonMode ? 'Exit Compare' : 'Compare'}
              </Button>
            </div>
          </div>
          {comparisonMode && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Select up to 4 items to compare their sustainability impact
              </p>
              {selectedForComparison.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">
                    {selectedForComparison.length}/4 selected
                  </span>
                  <Button size="sm" variant="ghost" onClick={clearComparison}>
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {items.map((item) => (
            <Card key={item.product.id} className={`transition-all ${
              comparisonMode && isInComparison(item.product.id) ? 'ring-2 ring-primary' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    {comparisonMode && (
                      <Button
                        size="sm"
                        variant={isInComparison(item.product.id) ? "default" : "outline"}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => handleToggleComparison(item.product.id)}
                      >
                        {isInComparison(item.product.id) ? (
                          <Minus className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link 
                          to={`/product/${item.product.id}`}
                          onClick={toggleWishlist}
                          className="font-semibold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {formatCurrency(item.product.price)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sustainability Impact */}
                    <div className="flex gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span>{item.product.impact.waterSaved}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Recycle className="h-3 w-3 text-green-500" />
                        <span>{item.product.impact.co2Reduced} CO₂</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Award className="h-3 w-3 text-purple-500" />
                        <span>{item.product.impact.recycledMaterials}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.product.certifications.slice(0, 3).map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {item.product.certifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.product.certifications.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Notes Section */}
                    {editingNotes === item.product.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add notes about this item..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNotes(item.product.id)}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNotes(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {item.notes ? (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.notes}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic mb-2">
                            No notes added
                          </p>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEditNotes(item.product.id, item.notes)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          {item.notes ? 'Edit Notes' : 'Add Notes'}
                        </Button>
                      </div>
                    )}

                    {/* Actions */}
                    <Separator className="my-3" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item.product.id)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-2" />
                        Add to Cart
                      </Button>
                      <Link to={`/product/${item.product.id}`} onClick={toggleWishlist}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};