import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, Leaf, Droplets, Recycle } from 'lucide-react';
import { Product, products } from '@/data/products';
import { useSustainabilityPreferences } from '@/hooks/use-sustainability-preferences';
import { recommendationEngine, type ProductRecommendation } from '@/utils/recommendation-engine';

interface ProductRecommendationsProps {
  currentProductId?: string;
  title?: string;
  limit?: number;
  showReasons?: boolean;
}

export function ProductRecommendations({ 
  currentProductId, 
  title = "Recommended for You",
  limit = 4,
  showReasons = true
}: ProductRecommendationsProps) {
  const { preferences, isOnboarded } = useSustainabilityPreferences();
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = () => {
      setLoading(true);
      
      if (!isOnboarded) {
        // Show similar products if not onboarded
        if (currentProductId) {
          const currentProduct = products.find(p => p.id === currentProductId);
          if (currentProduct) {
            const similar = recommendationEngine.generateSimilarProducts(
              currentProduct, 
              products, 
              limit
            );
            setRecommendations(similar.map(product => ({
              product,
              score: 0.8,
              reasons: ['Similar to current product'],
              sustainabilityMatch: 0.8,
              priceMatch: 0.8,
              categoryMatch: 1.0
            })));
          }
        } else {
          // Show top-rated products
          setRecommendations(products.slice(0, limit).map(product => ({
            product,
            score: 0.9,
            reasons: ['Popular choice', 'High sustainability rating'],
            sustainabilityMatch: 0.9,
            priceMatch: 0.8,
            categoryMatch: 0.8
          })));
        }
      } else {
        // Generate personalized recommendations
        const recs = recommendationEngine.generateRecommendations(
          products,
          preferences,
          currentProductId,
          limit
        );
        setRecommendations(recs);
      }
      
      setLoading(false);
    };

    generateRecommendations();
  }, [preferences, currentProductId, limit, isOnboarded]);

  const getImpactIcon = (product: Product) => {
    const waterSaved = parseFloat(product.impact.waterSaved.replace(/[L,]/g, ''));
    const co2Reduced = parseFloat(product.impact.co2Reduced.replace('kg', ''));
    const recycledPercentage = parseFloat(product.impact.recycledMaterials.replace('%', ''));

    if (recycledPercentage > 50) return Recycle;
    if (waterSaved > 3000) return Droplets;
    if (co2Reduced > 5) return Leaf;
    return Star;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        {isOnboarded && (
          <Badge variant="secondary" className="text-xs">
            Personalized
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => {
          const { product } = rec;
          const ImpactIcon = getImpactIcon(product);

          return (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                <img
                  src={product.images.main}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {isOnboarded && rec.score > 0.8 && (
                  <Badge className="absolute top-3 left-3 bg-sage-600">
                    <ImpactIcon className="h-3 w-3 mr-1" />
                    Perfect Match
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-lg leading-tight">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {isOnboarded && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-sage-500 text-sage-500" />
                      <span className="text-sm font-medium">
                        {(rec.score * 5).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {showReasons && rec.reasons.length > 0 && (
                  <div className="space-y-1">
                    {rec.reasons.slice(0, 2).map((reason, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-sage-600">
                        <div className="w-1 h-1 bg-sage-400 rounded-full"></div>
                        {reason}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {product.certifications.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>

                <Link to={`/products/${product.id}`}>
                  <Button className="w-full bg-sage-600 hover:bg-sage-700">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isOnboarded && (
        <div className="text-center py-8 bg-sage-50 rounded-lg">
          <Leaf className="h-12 w-12 text-sage-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h4>
          <p className="text-muted-foreground mb-4">
            Tell us about your sustainability preferences to see products tailored just for you.
          </p>
          <Link to="/preferences">
            <Button className="bg-sage-600 hover:bg-sage-700">
              Set Your Preferences
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}