import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
  computed,
} from '@angular/core';
import { ItemWithID, Item, ResponseItems } from '../item';
import { httpResource } from '@angular/common/http';
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

  productList = httpResource<ResponseItems>(() => ({
    url: `http://localhost:5000/api/products`,
    method: 'GET',
  }));

  productsSignal = computed(() => this.productList.value()?.items ?? []);

  get products(): Item[] {
    const val = this.productsSignal();
    console.log('Loaded products:', val);
    return Array.isArray(val) ? val : [];
  }

  filterItemsByName(name: string): ItemWithID[] {
    return this.products
      .map((item, index) => ({ ...item, id: index }))
      .filter((item) => item.title === name);
  }

  selectedItem: WritableSignal<string> = signal('');
  quantity: WritableSignal<number> = signal(1);
  selectedID = parseInt(this.selectedItem()) || -1;

  getSelectedProduct(): Item | null {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.products.length) {
      return null;
    }
    return this.products[itemId];
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
    if (isNaN(itemId) || itemId < 0 || itemId >= this.products.length) {
      return 0;
    }
    return this.products[itemId].stock;
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
    if (isNaN(itemId) || itemId < 0 || itemId >= this.products.length) {
      console.error('Invalid item selected');
      return;
    }
    const selectedItem = this.products[itemId];
    const quantityToAdd = this.quantity();

    console.log(`Adding to cart: ${this.selectedItem()}, Quantity: ${quantityToAdd}`);
    // TODO: Implement the add to cart functionality
  }

  buyNow(): void {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.products.length) {
      console.error('Invalid item selected');
      return;
    }
    const selectedItem = this.products[itemId];
    const quantityToBuy = this.quantity();

    console.log(`Buying now: ${this.selectedItem()}, Quantity: ${quantityToBuy}`);
    // TODO: Implement the buy now functionality
  }

  sumCost(): number {
    const itemId = parseInt(this.selectedItem());
    if (isNaN(itemId) || itemId < 0 || itemId >= this.products.length) {
      return 0;
    }
    const selectedItem = this.products[itemId];
    const quantityToBuy = this.quantity();
    return ((selectedItem.price ?? 0) * quantityToBuy).toFixed(2) as unknown as number;
  }
}
