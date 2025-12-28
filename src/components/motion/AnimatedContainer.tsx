import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { forwardRef } from "react";

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Fade up animation for items
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
};

// Scale in animation
export const scaleItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
};

// Tap animation props
export const tapAnimation = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Press animation for cards
export const cardPressAnimation = {
  whileTap: { scale: 0.98, y: 2 },
  whileHover: { y: -4 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Animated container component
interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      style={{ willChange: "opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

AnimatedContainer.displayName = "AnimatedContainer";

// Animated item for lists
export const AnimatedItem = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={fadeUpItem}
      style={{ willChange: "opacity, transform" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

AnimatedItem.displayName = "AnimatedItem";

// Page transition wrapper
export const PageTransition = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

PageTransition.displayName = "PageTransition";

// Card with hover/tap animations
export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={fadeUpItem}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      style={{ willChange: "transform" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

AnimatedCard.displayName = "AnimatedCard";
