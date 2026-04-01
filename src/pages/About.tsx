import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  Code2, Layers, Palette, Sparkles, Database,
  Shield, Zap, Globe, Heart, MonitorSmartphone,
  Component, Bot, ShoppingCart
} from "lucide-react";
import logo from "@/assets/logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring" as const, damping: 25, stiffness: 300 },
  }),
};

const techStack = [
  { icon: Code2, name: "React 18", desc: "Component-based UI library for building interactive interfaces with hooks and state management." },
  { icon: Zap, name: "Vite 5", desc: "Next-gen build tool with lightning-fast HMR and optimized production builds." },
  { icon: Palette, name: "Tailwind CSS", desc: "Utility-first CSS framework for rapid, consistent styling with design tokens." },
  { icon: Layers, name: "TypeScript", desc: "Type-safe JavaScript that catches errors at compile time, improving reliability." },
  { icon: Sparkles, name: "Framer Motion", desc: "Production-ready animation library for smooth, spring-based UI transitions." },
  { icon: Database, name: "Lovable Cloud", desc: "Backend-as-a-service providing database, auth, storage, and edge functions." },
];

const components = [
  {
    title: "🎨 Design System & Theming",
    content: "The app uses a custom dark theme built with CSS variables (HSL color tokens) defined in index.css. All colors flow through semantic tokens like --primary, --background, --foreground ensuring consistency. Tailwind CSS maps these tokens to utility classes. A ThemeContext provides dynamic theme switching.",
    code: `:root {
  --primary: 0 78% 50%;      /* Red accent */
  --background: 0 0% 12%;    /* Dark bg */
  --card: 0 0% 16%;          /* Card surfaces */
}`,
  },
  {
    title: "🔘 Buttons & Interactive Elements",
    content: "Buttons use the shadcn/ui Button component built with Class Variance Authority (CVA) for type-safe variants. Each variant (default, outline, ghost, destructive) maps to design tokens. Framer Motion adds whileTap={{ scale: 0.95 }} for tactile feedback. Active states use active:scale-95 CSS transitions.",
    code: `<Button variant="default" size="sm">
  {/* Renders with bg-primary text-primary-foreground */}
  {/* + hover:bg-primary/90 transition */}
</Button>

// With animation
<motion.button whileTap={{ scale: 0.9 }}>
  Click Me
</motion.button>`,
  },
  {
    title: "📦 Category Grid",
    content: "Categories display in a responsive 4-column CSS Grid. Each card uses a gradient background (from-card to-secondary/30) with a border that transitions to primary/50 on hover. Images use object-contain for proper scaling. Framer Motion staggerChildren creates a cascading entrance animation.",
    code: `<motion.div className="grid grid-cols-4 gap-4"
  variants={containerVariants}  // staggerChildren: 0.05
  initial="hidden" animate="visible">
  {categories.map(cat => (
    <motion.div variants={itemVariants}
      whileTap={{ scale: 0.9 }}
      className="rounded-2xl bg-gradient-to-br 
        from-card to-secondary/30 border border-border/40
        hover:border-primary/50 hover:shadow-primary/15">
      <img src={cat.image} className="object-contain" />
    </motion.div>
  ))}
</motion.div>`,
  },
  {
    title: "🤖 AI Chat Assistant",
    content: "The AI chatbot uses a bottom-mounted bar (fixed positioning) that opens a slide-up panel with AnimatePresence. Messages stream via Server-Sent Events (SSE) from a backend edge function connected to Google Gemini. The typing indicator uses three animated bouncing dots with staggered delays.",
    code: `// Bottom bar triggers slide-up panel
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28 }}>
      {/* Chat messages + streaming input */}
    </motion.div>
  )}
</AnimatePresence>`,
  },
  {
    title: "🛒 Cart & State Management",
    content: "The cart uses React Context (CartContext) with useReducer for predictable state updates. Actions include ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY. The cart persists across page navigations. Product data flows through ProductContext connected to the database via real-time queries.",
    code: `const CartContext = createContext<CartState>();

// Provider wraps the entire app
<CartProvider>
  <App />  {/* All children access cart */}
</CartProvider>

// Any component can use:
const { items, addItem, total } = useCart();`,
  },
  {
    title: "🔐 Authentication System",
    content: "Auth uses the backend's built-in authentication with email/password signup and login. An AuthContext wraps the app, providing user state and signOut. Protected routes check auth status. User roles are stored in a separate user_roles table with Row-Level Security (RLS) policies for proper access control.",
    code: `// AuthContext provides user state
const { user, signOut } = useAuth();

// Role-based access via database function
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;`,
  },
  {
    title: "📱 Responsive & PWA",
    content: "The app is fully responsive using Tailwind breakpoints (md:, lg:). A manifest.json enables Progressive Web App (PWA) installation. The viewport meta tag disables user scaling for a native app feel. The BottomNav renders only on mobile (md:hidden) while desktop gets a full header.",
    code: `<!-- PWA Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#dc2626" />
<link rel="manifest" href="/manifest.json" />

/* Responsive: mobile-first */
className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"`,
  },
  {
    title: "✨ Animations & Micro-interactions",
    content: "All animations use Framer Motion with spring physics for natural feel. Key patterns: staggerChildren for list entrances, layoutId for shared element transitions (nav indicator), AnimatePresence for exit animations, and whileTap/whileHover for interactive feedback.",
    code: `// Spring-based entrance
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      type: "spring",
      damping: 28,     // Controls bounce
      stiffness: 350,  // Controls speed
    },
  },
};`,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-36 relative">
      {/* Background watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src="/icon.png" alt="" className="w-[70%] max-w-[400px] opacity-[0.02]" />
      </div>

      <Header title="Sobre o Projeto" />

      <motion.main
        className="container px-4 py-6 space-y-8 relative z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hero Section */}
        <motion.section
          className="text-center space-y-5"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <img src={logo} alt="Segmento Positivo" className="w-16 h-16 object-contain" />
          </motion.div>

          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Segmento <span className="text-primary">Positivo</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-md mx-auto">
              A modern, full-stack automotive parts e-commerce application built with cutting-edge web technologies.
            </p>
          </div>

          {/* Author Card */}
          <motion.div
            className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-2xl px-5 py-3 border border-border/40 shadow-lg"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md shadow-primary/20">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Made by Muhammad Usman Qaiser 06</p>
              <p className="text-xs text-muted-foreground">Projeto de PAP — Eptoliva</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Technology Stack</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/30 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <tech.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{tech.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It's Built */}
        <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">How It's Built</h2>
          </div>

          <div className="space-y-4">
            {components.map((comp, i) => (
              <motion.div
                key={comp.title}
                custom={i + 5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-5">
                  <h3 className="text-base font-bold text-foreground mb-2">{comp.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{comp.content}</p>
                </div>
                <div className="bg-background/60 border-t border-border/30 px-5 py-4">
                  <pre className="text-[11px] text-muted-foreground font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    <code>{comp.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Architecture Overview */}
        <motion.section custom={10} variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Architecture Overview</h2>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/30 p-5 space-y-4">
            {[
              { icon: MonitorSmartphone, label: "Frontend", desc: "React + TypeScript SPA with Vite, served as static files" },
              { icon: Component, label: "UI Layer", desc: "shadcn/ui components + Tailwind CSS with custom design tokens" },
              { icon: Sparkles, label: "Animations", desc: "Framer Motion spring physics for natural, performant transitions" },
              { icon: Database, label: "Database", desc: "PostgreSQL with Row-Level Security for data protection" },
              { icon: Shield, label: "Auth", desc: "Email/password auth with role-based access control" },
              { icon: Bot, label: "AI Assistant", desc: "Edge function streaming via SSE, powered by Google Gemini" },
              { icon: ShoppingCart, label: "E-Commerce", desc: "Cart context, product catalog, order management with Stripe" },
              { icon: Globe, label: "Deployment", desc: "PWA-ready with manifest, optimized for mobile-first experience" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer Credit */}
        <motion.section
          custom={12}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center pt-4 pb-8"
        >
          <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl px-8 py-6 border border-primary/20 shadow-xl shadow-primary/5">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-foreground">Muhammad Usman Qaiser 06</p>
              <p className="text-sm text-primary font-semibold mt-1">Projeto de PAP</p>
              <p className="text-xs text-muted-foreground mt-0.5">Eptoliva — 2025/2026</p>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-muted-foreground">Built with</span>
              <Heart className="w-3 h-3 text-primary fill-primary" />
              <span className="text-[10px] text-muted-foreground">and modern web technologies</span>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <BottomNav />
    </div>
  );
};

export default About;
