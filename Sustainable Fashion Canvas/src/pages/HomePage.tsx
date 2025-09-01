import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Leaf, 
  Recycle, 
  Droplets, 
  Heart, 
  Star,
  ArrowRight,
  Check,
  Globe,
  TreePine,
  Wind,
  Sparkles
} from 'lucide-react'
import { products as productData } from '@/data/products'
import { ProductRecommendations } from '@/components/ProductRecommendations'
import { CartTrigger } from '@/components/ShoppingCart'
import { QuickAddToCart } from '@/components/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { Wishlist } from '@/components/Wishlist'
import { useWishlistStore } from '@/store/wishlist-store'



interface Achievement {
  icon: React.ComponentType<any>
  value: string
  label: string
  description: string
}

function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])



  const achievements: Achievement[] = [
    {
      icon: Droplets,
      value: '2.5M',
      label: 'Liters of Water Saved',
      description: 'Through innovative dyeing and production processes'
    },
    {
      icon: Recycle,
      value: '15K',
      label: 'Garments Recycled',
      description: 'Transformed into new sustainable fashion pieces'
    },
    {
      icon: TreePine,
      value: '5K',
      label: 'Trees Planted',
      description: 'Carbon offset program in reforestation projects'
    },
    {
      icon: Globe,
      value: '100%',
      label: 'Carbon Neutral',
      description: 'All operations powered by renewable energy'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EcoFashion</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#collections" className="text-foreground hover:text-primary transition-colors">Collections</a>
              <a href="#sustainability" className="text-foreground hover:text-primary transition-colors">Sustainability</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <Button variant="outline">Shop Now</Button>
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

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 natural-texture relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className={`space-y-6 ${isVisible ? 'slide-in-left' : ''}`}>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sustainable Fashion Revolution
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                  Where Style Meets
                  <span className="text-primary block">Sustainability</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Discover timeless pieces crafted with love for both you and our planet. 
                  Every thread tells a story of environmental consciousness and ethical production.
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 ${isVisible ? 'slide-in-left stagger-2' : ''}`}>
                <Button size="lg" className="h-14 px-8 text-lg">
                  Explore Collections
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                  Our Impact Story
                </Button>
              </div>
            </div>
            
            <div className={`relative ${isVisible ? 'slide-in-right stagger-1' : ''}`}>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop" 
                  alt="Sustainable Fashion Model"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/30 organic-blob animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 organic-blob animate-pulse" 
                   style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${isVisible ? 'slide-in-up stagger-3' : ''}`}>
              Conscious Collections
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isVisible ? 'slide-in-up stagger-4' : ''}`}>
              Each piece in our collection represents a commitment to sustainable practices, 
              ethical sourcing, and timeless design.
            </p>
          </div>

          {/* Staggered Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData.slice(0, 6).map((product, index) => (
              <Card key={product.id} 
                    className={`group overflow-hidden hover-lift cursor-pointer ${isVisible ? 'slide-in-up' : ''} stagger-${index + 1}`}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    onClick={() => navigate(`/product/${product.id}`)}>
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={product.images.main} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <Heart className="w-3 h-3 mr-1" />
                      Eco-Friendly
                    </Badge>
                  </div>
                  {product.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-sage-600 text-white">
                      Save ${product.originalPrice - product.price}
                    </Badge>
                  )}
                  <QuickAddToCart product={product} />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {product.materials.slice(0, 2).map((material) => (
                        <Badge key={material.name} variant="outline" className="text-xs">
                          {material.name}
                        </Badge>
                      ))}
                      {product.materials.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.materials.length - 2} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Check className="w-4 h-4" />
                      {product.certifications[0] || 'Sustainably Made'}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {product.sustainabilityStory}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <WishlistButton product={product} variant="outline" className="flex-1" />
                    <Button className="flex-1" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-earth-600 hover:bg-earth-700 text-white px-8 py-3"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sustainability Impact Section */}
      <section id="sustainability" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${isVisible ? 'slide-in-up stagger-3' : ''}`}>
              Our Environmental Impact
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isVisible ? 'slide-in-up stagger-4' : ''}`}>
              Transparency in our sustainability journey. Every number represents our commitment 
              to creating positive change for our planet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {achievements.map((achievement, index) => (
              <Card key={achievement.label} 
                    className={`text-center p-8 hover-lift ${isVisible ? 'slide-in-up' : ''} stagger-${index + 2}`}>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <achievement.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{achievement.value}</div>
                    <div className="text-lg font-semibold text-foreground">{achievement.label}</div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sustainability Principles */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`p-8 hover-lift ${isVisible ? 'slide-in-left stagger-5' : ''}`}>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Sustainable Materials</h3>
                <p className="text-muted-foreground">
                  We source only organic, recycled, and renewable materials that minimize 
                  environmental impact while maintaining the highest quality standards.
                </p>
              </div>
            </Card>

            <Card className={`p-8 hover-lift ${isVisible ? 'slide-in-up stagger-6' : ''}`}>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wind className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Clean Production</h3>
                <p className="text-muted-foreground">
                  Our manufacturing processes use renewable energy, minimal water, and 
                  non-toxic dyes to ensure every garment is created responsibly.
                </p>
              </div>
            </Card>

            <Card className={`p-8 hover-lift ${isVisible ? 'slide-in-right stagger-6' : ''}`}>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Ethical Labor</h3>
                <p className="text-muted-foreground">
                  Fair wages, safe working conditions, and community support are at the 
                  heart of our supply chain partnerships worldwide.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Recommendations */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <ProductRecommendations 
            title="Discover Your Perfect Sustainable Style"
            limit={4}
            showReasons={true}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 natural-texture">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${isVisible ? 'slide-in-up stagger-4' : ''}`}>
              Join the Sustainable Fashion Movement
            </h2>
            <p className={`text-xl text-muted-foreground ${isVisible ? 'slide-in-up stagger-5' : ''}`}>
              Every purchase supports regenerative agriculture, ethical labor practices, 
              and innovative sustainable technologies. Together, we're weaving a better future.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isVisible ? 'slide-in-up stagger-6' : ''}`}>
              <Button size="lg" className="h-14 px-8 text-lg">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">EcoFashion</span>
              </div>
              <p className="text-background/70">
                Sustainable fashion that doesn't compromise on style or ethics.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Shop</h4>
              <div className="space-y-2 text-background/70">
                <div>New Arrivals</div>
                <div>Women's Collection</div>
                <div>Men's Collection</div>
                <div>Accessories</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Sustainability</h4>
              <div className="space-y-2 text-background/70">
                <div>Our Impact</div>
                <div>Material Guide</div>
                <div>Certifications</div>
                <div>Carbon Offset</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="space-y-2 text-background/70">
                <div>Newsletter</div>
                <div>Community</div>
                <div>Support</div>
                <div>Returns</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/70">
            <p>&copy; 2024 EcoFashion. All rights reserved. Made with love for our planet.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage