import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, Leaf, Droplets, Recycle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getProductById, type Product } from '@/data/products';
import { ProductRecommendations } from '@/components/ProductRecommendations';
import { AddToCartButton } from '@/components/AddToCartButton';
import { CartTrigger } from '@/components/ShoppingCart';
import { WishlistButton } from '@/components/WishlistButton';
import { Wishlist } from '@/components/Wishlist';
import { useWishlistStore } from '@/store/wishlist-store';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/404');
      }
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-earth-600"></div>
      </div>
    );
  }





  const currentImages = selectedColor < product.colors.length 
    ? [product.colors[selectedColor].image, ...product.images.gallery.slice(1)]
    : product.images.gallery;

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
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-muted rounded-xl overflow-hidden group">
              <img
                src={currentImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-earth-500 shadow-lg' 
                      : 'border-transparent hover:border-sage-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sage-600 font-medium">{product.category}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(127 reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-earth-900 mb-3">{product.name}</h1>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-earth-800">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    <Badge variant="secondary" className="bg-sage-100 text-sage-800">
                      Save ${product.originalPrice - product.price}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Impact Metrics */}
            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-earth-900 mb-3 flex items-center">
                  <Leaf className="w-4 h-4 mr-2 text-sage-600" />
                  Environmental Impact
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Droplets className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                    <div className="font-bold text-earth-800">{product.impact.waterSaved}</div>
                    <div className="text-xs text-gray-600">Water Saved</div>
                  </div>
                  <div className="text-center">
                    <Recycle className="w-6 h-6 mx-auto mb-1 text-green-500" />
                    <div className="font-bold text-earth-800">{product.impact.co2Reduced}</div>
                    <div className="text-xs text-gray-600">CO2 Reduced</div>
                  </div>
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                    <div className="font-bold text-earth-800">{product.impact.recycledMaterials}</div>
                    <div className="text-xs text-gray-600">Recycled</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">
                Color: {product.colors[selectedColor].name}
              </label>
              <div className="flex space-x-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(index);
                      setSelectedImage(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === index 
                        ? 'border-earth-500 shadow-lg scale-110' 
                        : 'border-gray-300 hover:border-sage-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">Size</label>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-earth-500 bg-earth-500 text-white'
                        : 'border-gray-300 hover:border-sage-400 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-sage-400 transition-colors"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-sage-400 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <AddToCartButton
                product={product}
                selectedColor={product.colors[selectedColor]?.name || ''}
                selectedSize={selectedSize}
                quantity={quantity}
                size="lg"
                className="flex-1 h-12"
              />
              <WishlistButton
                product={product}
                variant="outline"
                size="lg"
                className="h-12 px-4"
              />
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="border-sage-300 text-sage-700">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="textures">Fabric Textures</TabsTrigger>
              <TabsTrigger value="care">Care Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-900 mb-4">Product Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-sage-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-900 mb-4">Sustainability Story</h3>
                  <p className="text-gray-700 leading-relaxed">{product.sustainabilityStory}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-6">
              {product.materials.map((material, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-earth-900">{material.name}</h3>
                        <p className="text-sage-600">{material.percentage}% of total composition</p>
                      </div>
                      <Badge variant="outline" className="border-sage-300 text-sage-700">
                        {material.sustainability}
                      </Badge>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-earth-900">Origin:</span>
                        <p className="text-gray-700 mt-1">{material.origin}</p>
                      </div>
                      <div>
                        <span className="font-medium text-earth-900">Sustainability:</span>
                        <p className="text-gray-700 mt-1">{material.sustainability}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="textures" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {product.images.textures.map((texture, index) => (
                  <Card key={index} className="overflow-hidden group">
                    <div className="aspect-square bg-muted">
                      <img
                        src={texture}
                        alt={`${product.name} fabric texture ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-earth-900 mb-2">
                        Texture Detail {index + 1}
                      </h4>
                      <p className="text-sm text-gray-600">
                        High-resolution view of the fabric weave and texture, showing the quality and craftsmanship of our sustainable materials.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="care" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-900 mb-4">Care Instructions</h3>
                  <div className="space-y-3">
                    {product.care.map((instruction, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-medium text-sage-700">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sage-50 border-sage-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-earth-900 mb-3">💡 Eco-Friendly Care Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Wash in cold water to save energy and preserve fabric quality</li>
                    <li>• Air dry when possible to reduce energy consumption</li>
                    <li>• Use biodegradable, eco-friendly detergents</li>
                    <li>• Wash only when necessary to extend garment life</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Product Recommendations */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <ProductRecommendations 
            currentProductId={product.id}
            title="You Might Also Like"
            limit={4}
            showReasons={true}
          />
        </div>
      </div>
    </div>
  );
}