import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBackButton() {
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={scrollToTop}
            className="md:hidden fixed bottom-24 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Down Button — larger tap target */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
        onClick={scrollDown}
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed bottom-24 left-4 z-40 p-5 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7" />
      </motion.button>
    </>
  );
}