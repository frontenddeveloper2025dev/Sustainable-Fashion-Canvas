import { Product } from '@/data/products';
import { UserPreferences } from '@/hooks/use-sustainability-preferences';

export interface ProductRecommendation {
  product: Product;
  score: number;
  reasons: string[];
  sustainabilityMatch: number;
  priceMatch: number;
  categoryMatch: number;
}

export class RecommendationEngine {
  private calculateSustainabilityScore(product: Product, preferences: UserPreferences): number {
    let score = 0;
    const reasons: string[] = [];

    // Material sustainability scoring
    preferences.sustainabilityFactors.forEach(factor => {
      switch (factor.id) {
        case 'organic':
          if (product.materials.some(m => m.sustainability.toLowerCase().includes('organic') || 
                                           m.sustainability.toLowerCase().includes('gots'))) {
            score += factor.weight * 0.2;
            reasons.push('Contains organic materials');
          }
          break;
        case 'recycled':
          const recycledPercentage = parseFloat(product.impact.recycledMaterials.replace('%', ''));
          if (recycledPercentage > 0) {
            score += factor.weight * 0.2 * (recycledPercentage / 100);
            reasons.push(`${recycledPercentage}% recycled materials`);
          }
          break;
        case 'water-conservation':
          const waterSaved = parseFloat(product.impact.waterSaved.replace(/[L,]/g, ''));
          if (waterSaved > 1000) {
            score += factor.weight * 0.15;
            reasons.push(`Saves ${product.impact.waterSaved} of water`);
          }
          break;
        case 'carbon-neutral':
          const co2Reduced = parseFloat(product.impact.co2Reduced.replace('kg', ''));
          if (co2Reduced > 2) {
            score += factor.weight * 0.15;
            reasons.push(`Reduces ${product.impact.co2Reduced} CO2`);
          }
          break;
        case 'fair-trade':
          if (product.certifications.some(cert => cert.toLowerCase().includes('fair trade'))) {
            score += factor.weight * 0.15;
            reasons.push('Fair Trade certified');
          }
          break;
        case 'durability':
          if (product.features.some(f => f.toLowerCase().includes('durable') || 
                                          f.toLowerCase().includes('long-lasting'))) {
            score += factor.weight * 0.15;
            reasons.push('Built for durability');
          }
          break;
      }
    });

    return Math.min(score, 1); // Cap at 1.0
  }

  private calculatePriceScore(product: Product, preferences: UserPreferences): number {
    const { min, max } = preferences.priceRange;
    if (product.price >= min && product.price <= max) {
      return 1.0;
    }
    if (product.price < min) {
      return 0.8; // Slightly lower score for being cheaper than preferred
    }
    if (product.price > max) {
      const overage = (product.price - max) / max;
      return Math.max(0, 1 - overage); // Penalty for being over budget
    }
    return 0;
  }

  private calculateCategoryScore(product: Product, preferences: UserPreferences): number {
    if (preferences.categories.length === 0) return 1.0; // No preference means all categories are good
    return preferences.categories.includes(product.category) ? 1.0 : 0.3;
  }

  private calculateCertificationScore(product: Product, preferences: UserPreferences): number {
    if (preferences.certifications.length === 0) return 1.0;
    const matches = product.certifications.filter(cert => 
      preferences.certifications.some(prefCert => 
        cert.toLowerCase().includes(prefCert.toLowerCase())
      )
    );
    return matches.length / preferences.certifications.length;
  }

  private calculateMaterialScore(product: Product, preferences: UserPreferences): number {
    if (preferences.materials.length === 0) return 1.0;
    const matches = product.materials.filter(material => 
      preferences.materials.some(prefMaterial => 
        material.name.toLowerCase().includes(prefMaterial.toLowerCase())
      )
    );
    return matches.length > 0 ? 1.0 : 0.5;
  }

  private calculateImpactScore(product: Product, preferences: UserPreferences): number {
    switch (preferences.impactPriority) {
      case 'water':
        const waterSaved = parseFloat(product.impact.waterSaved.replace(/[L,]/g, ''));
        return Math.min(waterSaved / 5000, 1); // Normalize to 5000L max
      case 'co2':
        const co2Reduced = parseFloat(product.impact.co2Reduced.replace('kg', ''));
        return Math.min(co2Reduced / 20, 1); // Normalize to 20kg max
      case 'recycled':
        const recycledPercentage = parseFloat(product.impact.recycledMaterials.replace('%', ''));
        return recycledPercentage / 100;
      case 'all':
      default:
        const waterScore = Math.min(parseFloat(product.impact.waterSaved.replace(/[L,]/g, '')) / 5000, 1);
        const co2Score = Math.min(parseFloat(product.impact.co2Reduced.replace('kg', '')) / 20, 1);
        const recycledScore = parseFloat(product.impact.recycledMaterials.replace('%', '')) / 100;
        return (waterScore + co2Score + recycledScore) / 3;
    }
  }

  public generateRecommendations(
    products: Product[], 
    preferences: UserPreferences, 
    currentProductId?: string,
    limit: number = 5
  ): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    products.forEach(product => {
      // Skip current product if specified
      if (currentProductId && product.id === currentProductId) return;

      const reasons: string[] = [];
      
      const sustainabilityScore = this.calculateSustainabilityScore(product, preferences);
      const priceScore = this.calculatePriceScore(product, preferences);
      const categoryScore = this.calculateCategoryScore(product, preferences);
      const certificationScore = this.calculateCertificationScore(product, preferences);
      const materialScore = this.calculateMaterialScore(product, preferences);
      const impactScore = this.calculateImpactScore(product, preferences);

      // Weighted overall score
      const overallScore = (
        sustainabilityScore * 0.35 +
        priceScore * 0.2 +
        categoryScore * 0.15 +
        certificationScore * 0.15 +
        materialScore * 0.1 +
        impactScore * 0.05
      );

      // Generate reasons based on high-scoring factors
      if (sustainabilityScore > 0.7) reasons.push('High sustainability rating');
      if (priceScore === 1.0) reasons.push('Within your budget');
      if (categoryScore === 1.0) reasons.push('Matches your preferred categories');
      if (certificationScore > 0.5) reasons.push('Has preferred certifications');
      if (materialScore === 1.0) reasons.push('Made with preferred materials');

      // Add specific sustainability reasons
      if (product.certifications.includes('GOTS Certified')) reasons.push('GOTS certified organic');
      if (parseFloat(product.impact.recycledMaterials.replace('%', '')) > 50) {
        reasons.push('High recycled content');
      }
      if (parseFloat(product.impact.waterSaved.replace(/[L,]/g, '')) > 3000) {
        reasons.push('Significant water savings');
      }

      recommendations.push({
        product,
        score: overallScore,
        reasons: reasons.slice(0, 3), // Limit to top 3 reasons
        sustainabilityMatch: sustainabilityScore,
        priceMatch: priceScore,
        categoryMatch: categoryScore
      });
    });

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  public generateSimilarProducts(
    targetProduct: Product, 
    allProducts: Product[], 
    limit: number = 4
  ): Product[] {
    const similar: { product: Product; similarity: number }[] = [];

    allProducts.forEach(product => {
      if (product.id === targetProduct.id) return;

      let similarity = 0;

      // Category match (highest weight)
      if (product.category === targetProduct.category) similarity += 0.4;

      // Price similarity
      const priceDiff = Math.abs(product.price - targetProduct.price) / targetProduct.price;
      similarity += (1 - Math.min(priceDiff, 1)) * 0.25;

      // Material similarity
      const commonMaterials = product.materials.filter(m1 => 
        targetProduct.materials.some(m2 => m1.name === m2.name)
      );
      similarity += (commonMaterials.length / Math.max(product.materials.length, targetProduct.materials.length)) * 0.2;

      // Certification similarity
      const commonCerts = product.certifications.filter(c1 => 
        targetProduct.certifications.includes(c1)
      );
      similarity += (commonCerts.length / Math.max(product.certifications.length, targetProduct.certifications.length)) * 0.15;

      similar.push({ product, similarity });
    });

    return similar
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.product);
  }
}

export const recommendationEngine = new RecommendationEngine();