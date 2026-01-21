export interface ResponseItems {
  items: Item;
  page: number;
  limit: number;
  total: number;
}

export interface Item {
  title: string;
  description: string;
  price: number;
  category: string;
  size: string;
  imageUrl: string;
  stock: number;
  isFeatured: boolean;
}

export interface ItemWithID extends Item {
  id: number;
}
