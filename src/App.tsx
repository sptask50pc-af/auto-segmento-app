import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ControlPanel from "./pages/ControlPanel";
import SubCategories from "./pages/SubCategories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/control-panel" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ControlPanel />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/subcategories/:category" element={<SubCategories />} />
                <Route path="/subcategories/:category/:subcategory" element={<SubCategories />} />
                <Route path="/subcategories/:category/:subcategory/:subsubcategory" element={<SubCategories />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
