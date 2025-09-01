import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Leaf, Droplets, Recycle } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const CartTrigger: React.FC = () => {
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-sage-50"
      onClick={toggleCart}
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-sage-600 text-white text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};

export const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice,
    sustainabilityImpact 
  } = useCartStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Sustainable Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingBag className="h-16 w-16 text-sage-300 mb-4" />
                <h3 className="text-lg font-medium text-sage-800 mb-2">Your cart is empty</h3>
                <p className="text-sage-600 mb-4">Add some sustainable fashion items to get started</p>
                <Button onClick={toggleCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`} 
                       className="flex gap-4 p-4 bg-white rounded-lg border border-sage-100">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sage-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-sage-600 mt-1">
                        {item.selectedColor} • {item.selectedSize}
                      </p>
                      <p className="text-sm font-medium text-sage-800 mt-1">
                        {formatCurrency(item.product.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(
                            item.product.id, 
                            item.selectedColor, 
                            item.selectedSize, 
                            item.quantity - 1
                          )}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(
                            item.product.id, 
                            item.selectedColor, 
                            item.selectedSize, 
                            item.quantity + 1
                          )}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-sage-400 hover:text-sage-600"
                      onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sustainability Impact Summary */}
          {items.length > 0 && (
            <div className="border-t border-sage-200 pt-4 mb-4">
              <h3 className="font-medium text-sage-800 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-sage-600" />
                Your Environmental Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-sage-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-sage-700">Water Saved</span>
                  </div>
                  <p className="text-lg font-bold text-sage-800">
                    {formatNumber(sustainabilityImpact.totalWaterSaved)}L
                  </p>
                </div>
                
                <div className="bg-sage-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-sage-700">CO₂ Reduced</span>
                  </div>
                  <p className="text-lg font-bold text-sage-800">
                    {sustainabilityImpact.totalCO2Reduced}kg
                  </p>
                </div>
              </div>
              
              {sustainabilityImpact.totalRecycledMaterials > 0 && (
                <div className="bg-sage-50 p-3 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Recycle className="h-4 w-4 text-sage-600" />
                    <span className="text-xs font-medium text-sage-700">Avg. Recycled Content</span>
                  </div>
                  <p className="text-lg font-bold text-sage-800">
                    {sustainabilityImpact.totalRecycledMaterials}%
                  </p>
                </div>
              )}
              
              {sustainabilityImpact.totalCertifications.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-sage-700 mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {sustainabilityImpact.totalCertifications.slice(0, 3).map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                        {cert}
                      </Badge>
                    ))}
                    {sustainabilityImpact.totalCertifications.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                        +{sustainabilityImpact.totalCertifications.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-sage-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-sage-800">Total</span>
                <span className="text-xl font-bold text-sage-800">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                  onClick={() => {
                    toggleCart();
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};