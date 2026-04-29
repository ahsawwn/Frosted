export interface SearchResults {
  products: Array<{
    id: string;
    name: string;
    stock: number;
    unit: string;
    price: number;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    createdAt: Date;
  }>;
  staff: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  timestamp: string;
}