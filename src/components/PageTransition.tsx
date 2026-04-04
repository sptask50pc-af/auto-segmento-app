import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
    className="w-full will-change-[opacity]"
  >
    {children}
  </motion.div>
);