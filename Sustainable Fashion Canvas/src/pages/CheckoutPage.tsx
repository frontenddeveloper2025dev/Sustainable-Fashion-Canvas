import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Leaf, Droplets, Recycle, Award, CreditCard, Truck, ShieldCheck } from 'lucide-react';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialInstructions?: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, sustainabilityImpact, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    specialInstructions: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Calculate shipping and tax
  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missing = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment fields
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const missing = requiredFields.filter(field => !paymentInfo[field as keyof PaymentInfo]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Payment Information",
        description: "Please fill in all payment details.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      
      toast({
        title: "Order Placed Successfully! 🌱",
        description: `Your eco-conscious order is being prepared. Thank you for making a sustainable choice!`,
      });
      
      // Navigate to success page
      navigate('/checkout/success');
      
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>Add some sustainable fashion items to get started!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/products')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-green-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-green-900">Checkout</h1>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-green-700 font-medium' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'shipping' ? 'bg-green-700 text-white' : step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                Shipping
              </div>
              <div className="w-8 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-green-700 font-medium' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-green-700 text-white' : step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                Payment
              </div>
              <div className="w-8 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 ${step === 'review' ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'review' ? 'bg-green-700 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                Review
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>
                    We use carbon-neutral shipping partners to minimize environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={shippingInfo.country} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Any specific delivery instructions..."
                        value={shippingInfo.specialInstructions}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Your payment is secured with bank-level encryption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="flex-1"
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit" className="flex-1 bg-green-700 hover:bg-green-800">
                        Review Order
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Order Review
                    </CardTitle>
                    <CardDescription>
                      Please review your order details before placing your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Shipping Details */}
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email}</p>
                        {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        <p>{paymentInfo.cardName}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('payment')}
                        className="flex-1"
                      >
                        Back to Payment
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-green-700 hover:bg-green-800"
                      >
                        {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-green-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-green-700">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-green-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {shipping === 0 && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center">
                    🎉 You qualify for free carbon-neutral shipping!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sustainability Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Your Environmental Impact
                </CardTitle>
                <CardDescription>
                  The positive impact of your sustainable choices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Droplets className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        {sustainabilityImpact.totalWaterSaved}L
                      </p>
                      <p className="text-xs text-blue-700">Water Saved</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">
                        {sustainabilityImpact.totalCO2Reduced}kg
                      </p>
                      <p className="text-xs text-green-700">CO₂ Reduced</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <Recycle className="w-8 h-8 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">
                        {sustainabilityImpact.totalRecycledMaterials}%
                      </p>
                      <p className="text-xs text-amber-700">Recycled Content</p>
                    </div>
                  </div>
                  
                  {sustainabilityImpact.totalCertifications.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Award className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-semibold text-purple-900">
                          {sustainabilityImpact.totalCertifications.length}
                        </p>
                        <p className="text-xs text-purple-700">Certifications</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {sustainabilityImpact.totalCertifications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {sustainabilityImpact.totalCertifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center">
                  🌱 Thank you for choosing sustainable fashion!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}