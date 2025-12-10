import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PromoBanner } from "@/components/PromoBanner";
import { mainCategories } from "@/data/mockData";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [pecasExpanded, setPecasExpanded] = useState(false);
  
  // Peças is first, rest are sub-categories
  const pecasCategory = mainCategories[0];
  const subCategories = mainCategories.slice(1);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Início" />

      <main className="container px-4 py-6 space-y-8">
        {/* Promo Banner */}
        <section className="animate-fade-in">
          <PromoBanner />
        </section>

        {/* Categorias principais */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Categorias principais</h2>
          
          {/* Peças - expandable */}
          <div className="mb-4">
            <div
              onClick={() => setPecasExpanded(!pecasExpanded)}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">
                {pecasCategory.icon}
              </div>
              <span className="flex-1 font-medium">{pecasCategory.label}</span>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${pecasExpanded ? 'rotate-180' : ''}`} 
              />
            </div>
            
            {/* Sub-categories */}
            {pecasExpanded && (
              <div className="grid grid-cols-3 gap-3 mt-3 pl-4 animate-fade-in">
                {subCategories.map((category, i) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-xl hover:border-primary/50 transition-colors">
                      {category.icon}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">{category.label}</span>
                  </div>
                ))}
              </div>
            )}
            <meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Segmento">
<link rel="apple-touch-icon" href="/icon.png">

  {
  "name": "Segmento",
  "short_name": "Segmento",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
 }



"display": "standalone"

</div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};


export default Index;
