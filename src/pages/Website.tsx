import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const Website = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Website" />
      
      <main className="flex-1 relative">
        <iframe
          src="https://www.segmentopositivo.pt/"
          className="absolute inset-0 w-full h-full border-0"
          title="Segmento Positivo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default Website;
