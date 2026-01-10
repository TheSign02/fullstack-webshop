import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Item, ItemWithID } from '../item';

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
})
export class ShopComponent {
  // productList = httpResource<Item[]>(() => ({
  //   url: `http://localhost:5000/api/products`,
  //   method: 'GET',
  // }));
  productList: Item[] = [
    {
      title: 'Sample Product 1',
      description: 'This is a sample product description.',
      price: 19.99,
      size: 'L',
      category: 'Tops',
      imageUrl: 'https://placehold.co/800',
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
      imageUrl: 'https://placehold.co/800',
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

  // UI state
  selectedCategory = 'All';
  sortOption = 'Most Popular';

  // compute available categories from data (keeps template simple)
  get categories(): string[] {
    const set = new Set(this.productList.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }

  // Called by template when a category button is clicked
  setCategory(category: string) {
    this.selectedCategory = category;
  }

  // Called by template when the sort selection changes
  setSort(option: string) {
    this.sortOption = option;
  }

  // Returns the products after applying category filter and sort
  get filteredProducts(): ItemWithID[] {
    let list: ItemWithID[] = this.productList.map((p, idx) => ({ ...p, id: idx }));

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter((p) => p.category === this.selectedCategory);
    }

    // Apply sorting
    switch (this.sortOption) {
      case 'Price: Low to High':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'Price: High to Low':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'Newest First':
        // If your data has a timestamp, sort by it.
        //  Here we assume the original array order is newest-first, so leave as-is.
        break;
      case 'Most Popular':
      default:
        // Simple popularity heuristic: featured items first, then by stock
        list.sort((a, b) => {
          const featuredDiff = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          if (featuredDiff !== 0) return featuredDiff;
          return (b.stock ?? 0) - (a.stock ?? 0);
        });
        break;
    }

    return list;
  }

  trackByTitle(_: number, item: ItemWithID) {
    return item.id;
  }
}
