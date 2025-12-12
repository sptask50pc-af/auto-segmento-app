export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  description?: string;
  sourceUrl?: string;
  reference?: string;
  weight?: string; // e.g., "1L", "500ml", "5L", "300g"
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
