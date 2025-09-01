import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Crown, 
  Droplets, 
  Recycle, 
  Award, 
  TrendingUp,
  Heart,
  ShoppingCart,
  GitCompare
} from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

export const SustainabilityComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { getComparison, removeFromComparison, clearComparison } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { toast } = useToast();

  const comparison = getComparison();

  const handleAddToCart = (productId: string) => {
    const product = comparison.products.find(p => p.id === productId);
    if (product) {
      const defaultColor = product.colors[0]?.name || 'Default';
      const defaultSize = product.sizes[0] || 'One Size';
      addToCart(product, defaultColor, defaultSize);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (comparison.products.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-earth-800">Sustainability Comparison</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GitCompare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Not enough items to compare</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You need at least 2 items in your wishlist to compare their sustainability impact. 
              Add more items to your wishlist and try again.
            </p>
            <Link to="/">
              <Button>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxWaterSaved = Math.max(...comparison.products.map(p => 
    parseFloat(p.impact.waterSaved.replace(/[^\d.]/g, '')) || 0
  ));
  const maxCO2Reduced = Math.max(...comparison.products.map(p => 
    parseFloat(p.impact.co2Reduced.replace(/[^\d.]/g, '')) || 0
  ));
  const maxRecycled = Math.max(...comparison.products.map(p => 
    parseFloat(p.impact.recycledMaterials.replace('%', '')) || 0
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-earth-800">Sustainability Comparison</h1>
          </div>
          <Button variant="outline" onClick={clearComparison}>
            Clear Comparison
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Best Water Saver</h3>
              <p className="text-sm text-muted-foreground">
                {comparison.bestWaterSaver?.name}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {comparison.bestWaterSaver?.impact.waterSaved}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Best CO₂ Reducer</h3>
              <p className="text-sm text-muted-foreground">
                {comparison.bestCO2Reducer?.name}
              </p>
              <p className="text-lg font-bold text-green-600">
                {comparison.bestCO2Reducer?.impact.co2Reduced}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Most Recycled</h3>
              <p className="text-sm text-muted-foreground">
                {comparison.mostRecycled?.name}
              </p>
              <p className="text-lg font-bold text-purple-600">
                {comparison.mostRecycled?.impact.recycledMaterials}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Most Certified</h3>
              <p className="text-sm text-muted-foreground">
                {comparison.mostCertifications?.name}
              </p>
              <p className="text-lg font-bold text-orange-600">
                {comparison.mostCertifications?.certifications.length} certs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Average Impact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Average Sustainability Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {comparison.averageImpact.waterSaved}L
                </p>
                <p className="text-sm text-muted-foreground">Average Water Saved</p>
              </div>
              <div className="text-center">
                <Recycle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {comparison.averageImpact.co2Reduced}kg
                </p>
                <p className="text-sm text-muted-foreground">Average CO₂ Reduced</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {comparison.averageImpact.recycledMaterials}%
                </p>
                <p className="text-sm text-muted-foreground">Average Recycled Content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {comparison.products.map((product) => {
            const waterSaved = parseFloat(product.impact.waterSaved.replace(/[^\d.]/g, '')) || 0;
            const co2Reduced = parseFloat(product.impact.co2Reduced.replace(/[^\d.]/g, '')) || 0;
            const recycledPercent = parseFloat(product.impact.recycledMaterials.replace('%', '')) || 0;
            const sustainabilityScore = comparison.sustainabilityScores[product.id] || 0;

            return (
              <Card key={product.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-xl font-bold text-earth-600 mt-2">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromComparison(product.id)}
                    >
                      ×
                    </Button>
                  </div>
                  
                  {/* Sustainability Score */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Sustainability Score</span>
                      <span className="text-2xl font-bold text-green-600">{sustainabilityScore}/100</span>
                    </div>
                    <Progress value={sustainabilityScore} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Product Image */}
                  <img
                    src={product.images.main}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  {/* Impact Metrics with Progress Bars */}
                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Water Saved</span>
                        </div>
                        <span className="text-sm font-bold">{product.impact.waterSaved}</span>
                      </div>
                      <Progress 
                        value={(waterSaved / maxWaterSaved) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Recycle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">CO₂ Reduced</span>
                        </div>
                        <span className="text-sm font-bold">{product.impact.co2Reduced}</span>
                      </div>
                      <Progress 
                        value={(co2Reduced / maxCO2Reduced) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Recycled Content</span>
                        </div>
                        <span className="text-sm font-bold">{product.impact.recycledMaterials}</span>
                      </div>
                      <Progress 
                        value={(recycledPercent / maxRecycled) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-3 w-3 mr-2" />
                      Add to Cart
                    </Button>
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Wishlist */}
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Back to Wishlist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};