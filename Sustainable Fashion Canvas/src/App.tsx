import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductPage from "@/pages/ProductPage";
import { PreferencesPage } from "@/pages/PreferencesPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import { SustainabilityComparePage } from "@/pages/SustainabilityComparePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShoppingCart } from "@/components/ShoppingCart";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/wishlist/compare" element={<SustainabilityComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ShoppingCart />
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
