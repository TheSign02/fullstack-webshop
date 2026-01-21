import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Item, ItemWithID, ResponseItems } from '../item';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
})
export class ProductsGridComponent {
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
  // UI state
  selectedCategory = 'All';
  sortOption = 'Most Popular';

  // compute available categories from data (keeps template simple)
  get categories(): string[] {
    const set = new Set(this.products.map((p: Item) => p.category));
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
  // Each returned item includes its originalIndex so templates can use it
  get filteredProducts(): ItemWithID[] {
    // Start from a mapped copy that retains original indices
    let list: ItemWithID[] = this.products.map((p: Item, idx: number) => ({ ...p, id: idx }));

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter((p) => p.category === this.selectedCategory);
    }

    // Apply sorting (doesn't change originalIndex values)
    switch (this.sortOption) {
      case 'Price: Low to High':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'Price: High to Low':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'Newest First':
        // If your data has a timestamp, sort by it. Here we assume the
        // original array order is newest-first, so leave as-is.
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

  // trackBy function to keep original index as identity for items
  trackByOriginalIndex(_: number, item: ItemWithID) {
    return item.id;
  }
}
