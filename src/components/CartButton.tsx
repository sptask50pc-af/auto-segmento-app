import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export function CartButton() {
  const { totalItems } = useCart() as { totalItems: number };
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative group hover:bg-primary/10 hover:scale-110 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:shadow-primary/20 rounded-full p-3"
      onClick={() => navigate("/cart")}
    >
      <ShoppingCart className="h-6 w-6 group-hover:text-primary transition-colors duration-200" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
}

