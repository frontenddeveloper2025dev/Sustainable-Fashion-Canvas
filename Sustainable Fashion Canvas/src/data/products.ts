export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  sustainabilityStory: string;
  materials: {
    name: string;
    percentage: number;
    sustainability: string;
    origin: string;
  }[];
  images: {
    main: string;
    gallery: string[];
    textures: string[];
  };
  features: string[];
  certifications: string[];
  colors: {
    name: string;
    hex: string;
    image: string;
  }[];
  sizes: string[];
  care: string[];
  impact: {
    waterSaved: string;
    co2Reduced: string;
    recycledMaterials: string;
  };
}

export const products: Product[] = [
  {
    id: "organic-cotton-dress",
    name: "Organic Cotton Summer Dress",
    category: "Dresses",
    price: 189,
    originalPrice: 249,
    description: "A flowing summer dress crafted from 100% organic cotton, featuring a comfortable fit and timeless silhouette. Perfect for warm days and effortlessly elegant occasions.",
    sustainabilityStory: "Our organic cotton is grown without harmful pesticides or synthetic fertilizers, supporting soil health and farmer wellbeing. Each dress saves 2,700 liters of water compared to conventional cotton alternatives.",
    materials: [
      {
        name: "Organic Cotton",
        percentage: 100,
        sustainability: "GOTS Certified",
        origin: "India - Fair Trade Farms"
      }
    ],
    images: {
      main: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop"
      ],
      textures: [
        "https://images.unsplash.com/photo-1586634299129-61d6d67b0ed5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
      ]
    },
    features: [
      "Breathable organic cotton fabric",
      "Adjustable tie waist",
      "Side pockets",
      "Machine washable",
      "Wrinkle resistant"
    ],
    certifications: ["GOTS Certified", "Fair Trade", "Carbon Neutral Shipping"],
    colors: [
      { name: "Natural White", hex: "#F5F5DC", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop" },
      { name: "Sage Green", hex: "#87A96B", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop" },
      { name: "Terracotta", hex: "#E07A5F", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    care: [
      "Machine wash cold with like colors",
      "Use eco-friendly detergent",
      "Tumble dry low or line dry",
      "Iron on low heat if needed"
    ],
    impact: {
      waterSaved: "2,700L",
      co2Reduced: "3.2kg",
      recycledMaterials: "0%"
    }
  },
  {
    id: "hemp-linen-shirt",
    name: "Hemp-Linen Blend Shirt",
    category: "Tops",
    price: 159,
    description: "A versatile button-up shirt made from a hemp-linen blend, offering exceptional breathability and durability. The perfect wardrobe staple for conscious consumers.",
    sustainabilityStory: "Hemp requires 50% less water than cotton and naturally enriches soil. Combined with European linen, this blend creates a fabric that becomes softer with each wear while maintaining its strength.",
    materials: [
      {
        name: "Hemp",
        percentage: 60,
        sustainability: "Regenerative Agriculture",
        origin: "France - Sustainable Farms"
      },
      {
        name: "Linen",
        percentage: 40,
        sustainability: "European Flax",
        origin: "Belgium - Traditional Mills"
      }
    ],
    images: {
      main: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1503341338804-a32fbd31b2be?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop"
      ],
      textures: [
        "https://images.unsplash.com/photo-1586634299129-61d6d67b0ed5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
      ]
    },
    features: [
      "Natural wrinkle resistance",
      "UV protection",
      "Antimicrobial properties",
      "Chest pocket",
      "Classic collar"
    ],
    certifications: ["OEKO-TEX Standard 100", "Cradle to Cradle Bronze"],
    colors: [
      { name: "Natural Beige", hex: "#D4B896", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop" },
      { name: "Olive", hex: "#6B7D6A", image: "https://images.unsplash.com/photo-1503341338804-a32fbd31b2be?w=400&h=500&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    care: [
      "Machine wash warm",
      "Natural soap recommended",
      "Air dry preferred",
      "Steam or iron on medium heat"
    ],
    impact: {
      waterSaved: "1,800L",
      co2Reduced: "2.1kg",
      recycledMaterials: "0%"
    }
  },
  {
    id: "recycled-wool-sweater",
    name: "Recycled Wool Sweater",
    category: "Knitwear",
    price: 229,
    originalPrice: 289,
    description: "A luxurious sweater crafted from 100% recycled wool, offering the same warmth and comfort as virgin wool while reducing environmental impact.",
    sustainabilityStory: "Made from post-consumer wool garments, this sweater diverts textile waste from landfills. The recycling process uses 70% less energy than producing new wool, while maintaining the natural properties that make wool exceptional.",
    materials: [
      {
        name: "Recycled Wool",
        percentage: 100,
        sustainability: "Post-Consumer Recycled",
        origin: "Italy - Circular Manufacturing"
      }
    ],
    images: {
      main: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=1000&fit=crop"
      ],
      textures: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
      ]
    },
    features: [
      "Temperature regulating",
      "Naturally odor resistant",
      "Soft merino feel",
      "Ribbed cuffs and hem",
      "Relaxed fit"
    ],
    certifications: ["RWS Certified", "Global Recycled Standard", "B Corp"],
    colors: [
      { name: "Charcoal", hex: "#36454F", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop" },
      { name: "Cream", hex: "#F5F5DC", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop" },
      { name: "Forest", hex: "#4F7942", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    care: [
      "Hand wash in cold water",
      "Use wool-specific detergent",
      "Lay flat to dry",
      "Store folded, not hung"
    ],
    impact: {
      waterSaved: "8,500L",
      co2Reduced: "15.3kg",
      recycledMaterials: "100%"
    }
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};