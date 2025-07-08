export interface Customer {
  id: string;
  user_id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstn?: string;
  customer_type: 'individual' | 'business';
  payment_terms: number;
  credit_limit?: number;
  opening_balance: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  customer_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstn?: string;
  customer_type: 'individual' | 'business';
  payment_terms: number;
  credit_limit?: number;
  opening_balance: number;
  notes?: string;
}