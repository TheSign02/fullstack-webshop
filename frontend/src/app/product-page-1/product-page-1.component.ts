import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { Item } from '../item';
import { ItemWithID } from '../item';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-page-1',
  standalone: true,
  templateUrl: './product-page-1.component.html',
  styleUrls: ['./product-page-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage1Component {
  id: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  productList: Item[] = [
    {
      title: 'Sample Product 1',
      description: 'This is a sample product description.',
      price: 19.99,
      size: 'L',
      category: 'Tops',
      imageUrl: 'https://placehold.co/400',
      stock: 10,
      isFeatured: true,
    },
    {
      title: 'Sample Product 2',
      description: 'This is another sample product description.',
      price: 29.99,
      size: 'XL',
      category: 'Jackets',
      imageUrl: 'https://placehold.co/400',
      stock: 5,
      isFeatured: false,
    },
    {
      title: 'Sample Product 1',
      description: 'This is a sample product description.',
      price: 19.0,
      size: 'S',
      category: 'Sweaters',
      imageUrl: 'https://placehold.co/400',
      stock: 11,
      isFeatured: false,
    },
    {
      title: 'Classic Wool Sweater',
      description: 'Comfortable and stylish wool sweater for everyday wear.',
      price: 49.99,
      category: 'Sweaters',
      size: 'M',
      imageUrl: 'https://placehold.co/400x500?text=Wool+Sweater',
      stock: 10,
      isFeatured: true,
    },
    {
      title: 'Cotton T-Shirt',
      description: 'Premium quality cotton t-shirt in multiple colors.',
      price: 24.99,
      category: 'Tops',
      size: 'L',
      imageUrl: 'https://placehold.co/400x500?text=Cotton+Tee',
      stock: 25,
      isFeatured: true,
    },
    {
      title: 'Denim Jacket',
      description: 'Classic blue denim jacket with modern fit.',
      price: 79.99,
      category: 'Jackets',
      size: 'M',
      imageUrl: 'https://placehold.co/400x500?text=Denim+Jacket',
      stock: 15,
      isFeatured: true,
    },
    {
      title: 'Leather Baseball Cap',
      description: 'Premium leather baseball cap with adjustable strap.',
      price: 34.99,
      category: 'Hats',
      size: 'One Size',
      imageUrl: 'https://placehold.co/400x500?text=Baseball+Cap',
      stock: 20,
      isFeatured: true,
    },
    {
      title: 'Cashmere Sweater',
      description: 'Luxurious cashmere sweater for ultimate comfort.',
      price: 129.99,
      category: 'Sweaters',
      size: 'S',
      imageUrl: 'https://placehold.co/400x500?text=Cashmere+Sweater',
      stock: 8,
      isFeatured: false,
    },
    {
      title: 'Striped Polo Shirt',
      description: 'Classic striped polo shirt perfect for any occasion.',
      price: 39.99,
      category: 'Tops',
      size: 'M',
      imageUrl: 'https://placehold.co/400x500?text=Polo+Shirt',
      stock: 18,
      isFeatured: false,
    },
    {
      title: 'Bomber Jacket',
      description: 'Trendy bomber jacket with zip closure.',
      price: 89.99,
      category: 'Jackets',
      size: 'L',
      imageUrl: 'https://placehold.co/400x500?text=Bomber+Jacket',
      stock: 12,
      isFeatured: false,
    },
    {
      title: 'Wool Beanie',
      description: 'Warm wool beanie for cold weather.',
      price: 19.99,
      category: 'Hats',
      size: 'One Size',
      imageUrl: 'https://placehold.co/400x500?text=Wool+Beanie',
      stock: 30,
      isFeatured: false,
    },
    {
      title: 'Linen Shirt',
      description: 'Lightweight linen shirt for summer.',
      price: 44.99,
      category: 'Tops',
      size: 'M',
      imageUrl: 'https://placehold.co/400x500?text=Linen+Shirt',
      stock: 14,
      isFeatured: false,
    },
    {
      title: 'Windbreaker Jacket',
      description: 'Water-resistant windbreaker jacket.',
      price: 69.99,
      category: 'Jackets',
      size: 'M',
      imageUrl: 'https://placehold.co/400x500?text=Windbreaker',
      stock: 11,
      isFeatured: false,
    },
    {
      title: 'Merino Wool Sweater',
      description: 'Breathable merino wool sweater.',
      price: 59.99,
      category: 'Sweaters',
      size: 'L',
      imageUrl: 'https://placehold.co/400x500?text=Merino+Sweater',
      stock: 9,
      isFeatured: true,
    },
    {
      title: 'Canvas Cap',
      description: 'Durable canvas cap with embroidered logo.',
      price: 24.99,
      category: 'Hats',
      size: 'One Size',
      imageUrl: 'https://placehold.co/400x500?text=Canvas+Cap',
      stock: 22,
      isFeatured: false,
    },
    {
      title: 'Henley Shirt',
      description: 'Classic henley shirt with three-button placket.',
      price: 29.99,
      category: 'Tops',
      size: 'S',
      imageUrl: 'https://placehold.co/400x500?text=Henley+Shirt',
      stock: 19,
      isFeatured: false,
    },
    {
      title: 'Peacoat',
      description: 'Elegant wool peacoat for formal occasions.',
      price: 119.99,
      category: 'Jackets',
      size: 'L',
      imageUrl: 'https://placehold.co/400x500?text=Peacoat',
      stock: 7,
      isFeatured: false,
    },
    {
      title: 'Sun Hat',
      description: 'Wide-brimmed sun hat for beach and outdoor activities.',
      price: 29.99,
      category: 'Hats',
      size: 'One Size',
      imageUrl: 'https://placehold.co/400x500?text=Sun+Hat',
      stock: 16,
      isFeatured: false,
    },
  ];

  filterItemsByName(name: string): ItemWithID[] {
    return this.productList
      .map((item, index) => ({ ...item, id: index }))
      .filter((item) => item.title === name);
  }

  selectedItem: WritableSignal<string> = signal('');
  quantity: WritableSignal<number> = signal(1);
  selectedID = parseInt(this.selectedItem()) || -1;

  getSelectedProduct(): Item | null {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.productList.length) {
      return null;
    }
    return this.productList[itemId];
  }

  onChange(event: Event) {
    this.selectedItem.set((event.target as HTMLSelectElement).value);
    const availableStock = this.getSelectedItemStock();
    if (availableStock < this.quantity()) {
      this.quantity.set(availableStock);
    }
    console.log('New Selected Item:', this.selectedItem());
  }

  getSelectedItemStock(): number {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.productList.length) {
      return 0;
    }
    return this.productList[itemId].stock;
  }

  increment(): void {
    const maxStock = this.getSelectedItemStock();
    if (this.quantity() < maxStock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrement(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.productList.length) {
      console.error('Invalid item selected');
      return;
    }
    const selectedItem = this.productList[itemId];
    const quantityToAdd = this.quantity();

    console.log(`Adding to cart: ${this.selectedItem()}, Quantity: ${quantityToAdd}`);
    // TODO: Implement the add to cart functionality
  }

  buyNow(): void {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.productList.length) {
      console.error('Invalid item selected');
      return;
    }
    const selectedItem = this.productList[itemId];
    const quantityToBuy = this.quantity();

    console.log(`Buying now: ${this.selectedItem()}, Quantity: ${quantityToBuy}`);
    // TODO: Implement the buy now functionality
  }

  sumCost(): number {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.productList.length) {
      return 0;
    }
    const selectedItem = this.productList[itemId];
    const quantityToBuy = this.quantity();
    return ((selectedItem.price ?? 0) * quantityToBuy).toFixed(2) as unknown as number;
  }
}
