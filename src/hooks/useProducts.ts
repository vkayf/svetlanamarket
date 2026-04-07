import { useState, useEffect, useCallback } from 'react';
import { supabase, Product } from '@/lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (err) {
      setError(err.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();

    const channelName = `products-${Date.now()}-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { error: err } = await supabase.from('products').insert(product);
    if (err) throw new Error(err.message);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error: err } = await supabase.from('products').update(updates).eq('id', id);
    if (err) throw new Error(err.message);
  };

  const deleteProduct = async (id: string) => {
    const { error: err } = await supabase.from('products').delete().eq('id', id);
    if (err) throw new Error(err.message);
  };

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock);

  return { products, loading, error, addProduct, updateProduct, deleteProduct, lowStockProducts, refetch: fetchProducts };
}
