declare module "react" {
  export type ReactNode = any;
  export type ReactElement = any;
  export type Context<T> = any;
  export type RefObject<T> = { current: T | null };
  export interface Attributes {
    key?: string | number;
  }
  export interface DOMAttributes<T> {
    onClick?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onChange?: (event: any) => void;
  }
  export interface HTMLAttributes<T> extends DOMAttributes<T> {
    id?: string;
    className?: string;
    style?: Record<string, string>;
    children?: ReactNode;
    href?: string;
    [key: string]: any;
  }
  export type ElementRef<T> = any;
  export type ComponentPropsWithoutRef<T> = any;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode;
    displayName?: string;
  }
  export type ComponentType<P = {}> = FunctionComponent<P>;
  export interface PropsWithChildren<P> {
    children?: ReactNode;
  }

  export function createContext<T>(defaultValue: T): Context<T>;
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useContext<T>(context: Context<T>): T;
  export const Fragment: any;
  export const Suspense: any;
  export function memo<T>(component: T): T;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactNode): any;

  export namespace React {
    export interface KeyboardEvent {
      key: string;
      shiftKey: boolean;
      preventDefault(): void;
    }
  }
}

declare namespace React {
  interface KeyboardEvent {
    key: string;
    shiftKey: boolean;
    preventDefault(): void;
  }
}

declare module "react-dom" {
  export function createRoot(container: any): { render(el: any): void; };
}

declare module "react-router-dom" {
  import { ComponentType, ReactNode } from "react";

  export interface LinkProps {
    to: string;
    children?: ReactNode;
    className?: string;
  }
  export interface NavLinkProps extends LinkProps {
    end?: boolean;
    reloadDocument?: boolean;
  }

  export const Link: ComponentType<LinkProps & import("react").HTMLAttributes<HTMLAnchorElement>>;
  export const NavLink: ComponentType<NavLinkProps & import("react").HTMLAttributes<HTMLAnchorElement>>;
  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
  export const Route: ComponentType<any>;
  export const Routes: ComponentType<any>;
  export function useNavigate(): (to: string) => void;
  export function useParams(): Record<string, string>;
  export function useLocation(): { pathname: string; search: string; hash: string };
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
    [key: string]: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

declare module "react/jsx-runtime" {
  import type { ReactNode } from "react";
  export function jsx(type: any, props: any, key?: string | number): ReactNode;
  export function jsxs(type: any, props: any, key?: string | number): ReactNode;
  export function jsxDEV(type: any, props: any, key?: string | number, isStatic?: boolean, source?: any, self?: any): ReactNode;
}

declare module "framer-motion" {
  import { ComponentType } from "react";
  export const motion: any;
  export const AnimatePresence: ComponentType<any>;
}

declare module "@radix-ui/react-tabs" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{ children?: ReactNode }>;
  export const List: ComponentType<{ children?: ReactNode }>;
  export const Trigger: ComponentType<{ children?: ReactNode }>;
  export const Content: ComponentType<{ children?: ReactNode }>;
}

declare module "@radix-ui/react-tooltip" {
  import { ComponentType, ReactNode } from "react";
  export const Provider: ComponentType<{ children?: ReactNode }>;
  export const Root: ComponentType<{ children?: ReactNode }>;
  export const Trigger: ComponentType<{ children?: ReactNode }>;
  export const Content: ComponentType<{ children?: ReactNode }>;
  export const Arrow: ComponentType<{ children?: ReactNode }>;
  export const Portal: ComponentType<{ children?: ReactNode }>;
}

declare module "lucide-react" {
  import { ComponentType, SVGProps } from "react";
  type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const Camera: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const Clock: LucideIcon;
  export const Component: LucideIcon;
  export const Database: LucideIcon;
  export const Dot: LucideIcon;
  export const Edit2: LucideIcon;
  export const Eye: LucideIcon;
  export const Globe: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Heart: LucideIcon;
  export const Home: LucideIcon;
  export const Loader2: LucideIcon;
  export const LogOut: LucideIcon;
  export const Lock: LucideIcon;
  export const MapPin: LucideIcon;
  export const Minus: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Moon: LucideIcon;
  export const Package: LucideIcon;
  export const Percent: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Sun: LucideIcon;
  export const Trash2: LucideIcon;
  export const Truck: LucideIcon;
  export const Upload: LucideIcon;
  export const User: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Bot: LucideIcon;
  export const Palette: LucideIcon;
  export const Send: LucideIcon;
  export default ChevronRight;
}
