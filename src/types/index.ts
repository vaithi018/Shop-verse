export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
