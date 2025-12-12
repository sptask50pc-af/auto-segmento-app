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
