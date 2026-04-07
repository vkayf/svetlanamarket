import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjetjghhsnvbahvubzvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZXRqZ2hoc252YmFodnVienZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTU3MzksImV4cCI6MjA5MTA3MTczOX0.5_6HnuiVqO6IxRv5NsHI-ytoJ7yt3cFpSl713C1sgY8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Product = {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  sell_price: number;
  stock: number;
  min_stock: number;
  supplier_name: string | null;
  supplier_telegram: string | null;
  created_at: string;
  updated_at: string;
};

export type Operation = {
  id: string;
  product_id: string;
  type: 'stock_in' | 'stock_out' | 'correction' | 'sale';
  quantity: number;
  note: string | null;
  created_at: string;
};

export type Batch = {
  id: string;
  product_id: string;
  quantity: number;
  cost_price: number;
  date: string;
  created_at: string;
};

export type CashLog = {
  id: string;
  type: 'revenue' | 'expense' | 'withdrawal';
  amount: number;
  description: string | null;
  created_at: string;
};

export type Credit = {
  id: string;
  customer_name: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  created_at: string;
};
