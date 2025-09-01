import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  useSustainabilityPreferences, 
  type SustainabilityPreference,
  type UserPreferences 
} from '@/hooks/use-sustainability-preferences';
import { Leaf, Droplets, Recycle, Heart, Award, Shield } from 'lucide-react';

interface OnboardingProps {
  onComplete?: () => void;
}

const sustainabilityIcons = {
  organic: Leaf,
  recycled: Recycle,
  'water-conservation': Droplets,
  'carbon-neutral': Leaf,
  'fair-trade': Heart,
  durability: Shield,
};

export function SustainabilityOnboarding({ onComplete }: OnboardingProps) {
  const { preferences, updatePreferences, completeOnboarding } = useSustainabilityPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [tempPreferences, setTempPreferences] = useState<UserPreferences>(preferences);

  const steps = [
    {
      title: "What matters most to you?",
      description: "Help us understand your sustainability priorities",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Rate how important each factor is to you (drag the sliders)
          </p>
          <div className="space-y-4">
            {tempPreferences.sustainabilityFactors.map((factor) => {
              const Icon = sustainabilityIcons[factor.id as keyof typeof sustainabilityIcons] || Award;
              return (
                <div key={factor.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-sage-600" />
                    <span className="font-medium">{factor.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {Math.round(factor.weight * 100)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[factor.weight * 100]}
                    onValueChange={(value) => {
                      setTempPreferences(prev => ({
                        ...prev,
                        sustainabilityFactors: prev.sustainabilityFactors.map(f =>
                          f.id === factor.id ? { ...f, weight: value[0] / 100 } : f
                        )
                      }));
                    }}
                    max={100}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      title: "Budget Range",
      description: "What's your typical spending range for sustainable fashion?",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>${tempPreferences.priceRange.min}</span>
              <span>${tempPreferences.priceRange.max}</span>
            </div>
            <Slider
              value={[tempPreferences.priceRange.min, tempPreferences.priceRange.max]}
              onValueChange={(value) => {
                setTempPreferences(prev => ({
                  ...prev,
                  priceRange: { min: value[0], max: value[1] }
                }));
              }}
              max={500}
              min={50}
              step={25}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-700">${tempPreferences.priceRange.min}</div>
              <div className="text-sm text-sage-600">Minimum</div>
            </div>
            <div className="text-center p-4 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-700">${tempPreferences.priceRange.max}</div>
              <div className="text-sm text-sage-600">Maximum</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Preferred Categories",
      description: "Which types of clothing are you most interested in?",
      content: (
        <div className="space-y-4">
          {['Dresses', 'Tops', 'Knitwear', 'Outerwear', 'Pants', 'Accessories'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={tempPreferences.categories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTempPreferences(prev => ({
                      ...prev,
                      categories: [...prev.categories, category]
                    }));
                  } else {
                    setTempPreferences(prev => ({
                      ...prev,
                      categories: prev.categories.filter(c => c !== category)
                    }));
                  }
                }}
              />
              <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category}
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Impact Priority",
      description: "Which environmental impact matters most to you?",
      content: (
        <div className="space-y-3">
          {[
            { id: 'water', label: 'Water Conservation', description: 'Prioritize products that save the most water' },
            { id: 'co2', label: 'Carbon Footprint', description: 'Focus on reducing CO2 emissions' },
            { id: 'recycled', label: 'Recycled Materials', description: 'Prefer products with recycled content' },
            { id: 'all', label: 'Balanced Approach', description: 'Consider all environmental factors equally' },
          ].map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                tempPreferences.impactPriority === option.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-sage-300'
              }`}
              onClick={() => {
                setTempPreferences(prev => ({
                  ...prev,
                  impactPriority: option.id as any
                }));
              }}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      updatePreferences(tempPreferences);
      completeOnboarding();
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {steps[currentStep].description}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-sage-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}