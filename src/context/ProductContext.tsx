import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  refetch: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        image: p.image,
        category: p.category,
        brand: p.brand || undefined,
        inStock: p.stock === 'Em stock',
        stock: p.stock || 'Em stock',
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          id: Date.now().toString(),
          name: product.name,
          price: product.price,
          original_price: product.originalPrice || null,
          image: product.image,
          category: product.category,
          brand: product.brand || null,
          stock: product.inStock ? 'Em stock' : 'Sem stock',
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        image: data.image,
        category: data.category,
        brand: data.brand || undefined,
        inStock: data.stock === 'Em stock',
      };

      setProducts((prev) => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updatedFields.name !== undefined) updateData.name = updatedFields.name;
      if (updatedFields.price !== undefined) updateData.price = updatedFields.price;
      if (updatedFields.originalPrice !== undefined) updateData.original_price = updatedFields.originalPrice;
      if (updatedFields.image !== undefined) updateData.image = updatedFields.image;
      if (updatedFields.category !== undefined) updateData.category = updatedFields.category;
      if (updatedFields.brand !== undefined) updateData.brand = updatedFields.brand;
      if (updatedFields.inStock !== undefined) updateData.stock = updatedFields.inStock ? 'Em stock' : 'Sem stock';

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const deleteAllProducts = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '');

      if (error) throw error;

      setProducts([]);
    } catch (error) {
      console.error('Error deleting all products:', error);
      throw error;
    }
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter((p) => 
      p.category.toLowerCase() === category.toLowerCase() ||
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct, deleteAllProducts, getProductsByCategory, refetch: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
