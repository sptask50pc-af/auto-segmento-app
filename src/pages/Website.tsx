import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ADMIN_URL = "https://www.segmentopositivo.pt/adminloja/index.php/sell/catalog/products";

const Website = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Admin Loja" />
      
      <main className="flex-1 relative">
        {/* Fallback link in case iframe is blocked */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(ADMIN_URL, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir em nova aba
          </Button>
        </div>
        
        <iframe
          src={ADMIN_URL}
          className="absolute inset-0 w-full h-full border-0 pt-12"
          title="Admin Loja - Segmento Positivo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default Website;
