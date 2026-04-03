import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export function CartButton() {
  const { totalItems } = useCart() as { totalItems: number };
  const navigate = useNavigate();
  const maxItems = 99;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative group p-3 rounded-full shadow-lg hover:bg-primary/10 hover:scale-110 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-out"
      onClick={() => navigate("/cart")}
      title="View Cart"
    >
      <ShoppingCart className="h-6 w-6 group-hover:text-primary transition-colors duration-200" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-md animate-pulse">
          {totalItems > maxItems ? `${maxItems}+` : totalItems}
        </span>
      )}
    </Button>
  );
}