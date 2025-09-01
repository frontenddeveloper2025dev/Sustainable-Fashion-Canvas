import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, type Product } from '@/data/products';
import { CartTrigger } from '@/components/ShoppingCart';
import { QuickAddToCart } from '@/components/AddToCartButton';
import { WishlistButton } from '@/components/WishlistButton';
import { Wishlist } from '@/components/Wishlist';
import { useWishlistStore } from '@/store/wishlist-store';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...filteredProducts];
    
    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };

  const handleFilter = (category: string) => {
    setFilterCategory(category);
    const filtered = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sage-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-earth-700 hover:text-earth-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Wishlist>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist ({useWishlistStore.getState().getTotalItems()})
                </Button>
              </Wishlist>
              <CartTrigger />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-earth-900 mb-4">Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of sustainable fashion items, 
            each crafted with love for both style and the environment.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8 p-4 bg-white rounded-xl border border-sage-200">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-earth-600" />
            <Select value={filterCategory} onValueChange={handleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <img
                  src={product.images.main}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-sage-600 text-white">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <WishlistButton 
                    product={product} 
                    variant="ghost" 
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  />
                </div>
                <QuickAddToCart product={product} className="absolute bottom-4 right-4" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sage-600 font-medium">{product.category}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                
                <h3 className="font-semibold text-earth-900 mb-2 group-hover:text-earth-700 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-earth-800">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Material highlights */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.materials.slice(0, 2).map((material, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs border-sage-300 text-sage-700"
                    >
                      {material.name}
                    </Badge>
                  ))}
                  {product.materials.length > 2 && (
                    <Badge variant="outline" className="text-xs border-sage-300 text-sage-700">
                      +{product.materials.length - 2} more
                    </Badge>
                  )}
                </div>
                
                {/* Sustainability highlight */}
                <div className="text-xs text-sage-600 line-clamp-2">
                  {product.sustainabilityStory}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-earth-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more products.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-sage-100 rounded-2xl">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">
            Didn't find what you're looking for?
          </h2>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            Our collection is constantly growing. Sign up for updates on new sustainable arrivals.
          </p>
          <Button className="bg-earth-600 hover:bg-earth-700 text-white">
            Notify Me of New Arrivals
          </Button>
        </div>
      </div>
    </div>
  );
}