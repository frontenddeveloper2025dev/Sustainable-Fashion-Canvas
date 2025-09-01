import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SustainabilityOnboarding } from '@/components/SustainabilityOnboarding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSustainabilityPreferences } from '@/hooks/use-sustainability-preferences';
import { ArrowLeft, Settings, Leaf, User } from 'lucide-react';

export function PreferencesPage() {
  const navigate = useNavigate();
  const { preferences, isOnboarded, resetPreferences } = useSustainabilityPreferences();
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/', { replace: true });
  };

  const handleResetPreferences = () => {
    resetPreferences();
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-sage-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Sustainability Preferences</h1>
              <p className="text-muted-foreground text-lg">
                Help us understand what matters most to you in sustainable fashion
              </p>
            </div>
            
            <SustainabilityOnboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Your Sustainability Profile</h1>
              <p className="text-muted-foreground">
                Manage your preferences to get better product recommendations
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sage-100 rounded-lg">
                    <User className="h-6 w-6 text-sage-600" />
                  </div>
                  <div>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>Your current sustainability preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-sage-50 rounded-lg">
                    <div className="text-2xl font-bold text-sage-700">
                      ${preferences.priceRange.min} - ${preferences.priceRange.max}
                    </div>
                    <div className="text-sm text-sage-600">Budget Range</div>
                  </div>
                  <div className="text-center p-4 bg-sage-50 rounded-lg">
                    <div className="text-2xl font-bold text-sage-700">
                      {preferences.categories.length || 'All'}
                    </div>
                    <div className="text-sm text-sage-600">Preferred Categories</div>
                  </div>
                  <div className="text-center p-4 bg-sage-50 rounded-lg">
                    <div className="text-2xl font-bold text-sage-700 capitalize">
                      {preferences.impactPriority}
                    </div>
                    <div className="text-sm text-sage-600">Impact Priority</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Priorities</CardTitle>
                <CardDescription>How important each factor is to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferences.sustainabilityFactors.map((factor) => (
                    <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{factor.name}</span>
                      <Badge variant={factor.weight > 0.7 ? 'default' : factor.weight > 0.4 ? 'secondary' : 'outline'}>
                        {Math.round(factor.weight * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Categories */}
            {preferences.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Preferred Categories</CardTitle>
                  <CardDescription>Product types you're most interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preferences.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle>Preference Settings</CardTitle>
                    <CardDescription>Update or reset your preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button 
                  onClick={handleResetPreferences}
                  variant="outline"
                  className="flex-1"
                >
                  Update Preferences
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-sage-600 hover:bg-sage-700"
                >
                  View Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}