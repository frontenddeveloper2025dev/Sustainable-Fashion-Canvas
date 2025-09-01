import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck, Leaf, ArrowRight, Home, Package } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  // Generate a random order number for demonstration
  const orderNumber = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Order Placed Successfully! 🌱
            </h1>
            <p className="text-lg text-green-700">
              Thank you for choosing sustainable fashion
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-green-900">Order Confirmation</CardTitle>
              <CardDescription>
                We've sent a confirmation email with your order details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700 mb-1">Order Number</p>
                <p className="text-xl font-bold text-green-900">{orderNumber}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Carbon-Neutral Shipping</h3>
                    <p className="text-sm text-gray-600">
                      Your order will arrive in 3-5 business days with zero carbon footprint
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Package className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sustainable Packaging</h3>
                    <p className="text-sm text-gray-600">
                      Packaged in 100% recyclable and biodegradable materials
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-green-900">
                <Leaf className="w-5 h-5" />
                Your Environmental Impact
              </CardTitle>
              <CardDescription>
                The positive difference you're making with this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900 mb-1">~500L</div>
                  <div className="text-sm text-blue-700">Water Saved</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900 mb-1">~15kg</div>
                  <div className="text-sm text-green-700">CO₂ Reduced</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-900 mb-1">85%</div>
                  <div className="text-sm text-amber-700">Recycled Materials</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
                <p className="text-green-800 font-medium">
                  🌍 You've made a positive impact on our planet!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Every sustainable choice counts towards a better future
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-900 mb-4">What's Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📧</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600">
                    Order confirmation and tracking details sent to your inbox
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
                  <p className="text-sm text-gray-600">
                    Follow your sustainable package from our facility to your door
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="bg-green-700 hover:bg-green-800"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-amber-50 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Thank You for Choosing Sustainability! 🌱
            </h3>
            <p className="text-green-700">
              Your support helps us continue creating beautiful, eco-conscious fashion 
              while protecting our planet for future generations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}