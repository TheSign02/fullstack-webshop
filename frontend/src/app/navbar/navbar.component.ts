import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Added Router
import { httpResource } from '@angular/common/http';
import { Item, ItemWithID, ResponseItems } from '../item';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  // Added implements OnDestroy
  @ViewChild('navSearchInput') navSearchInput?: ElementRef<HTMLInputElement>; // Added ViewChild

  constructor(private router: Router) {} // Added constructor and injected Router

  // Fetch products similarly to the shop component so navbar can search the same source
  productList = httpResource<ResponseItems>(() => ({
    url: `http://localhost:5000/api/products`,
    method: 'GET',
  }));

  productsSignal = computed(() => this.productList.value()?.items ?? []);

  get products(): Item[] {
    const val = this.productsSignal();
    return Array.isArray(val) ? val : [];
  }

  // Template-driven search state (public so template can bind)
  // `search` reflects the raw input value; `debouncedQuery` is updated after a short delay.
  search = signal('');
  debouncedQuery = signal('');
  private debounceMs = 200;
  private debounceTimer: any = null;

  // highlighted index for keyboard navigation (-1 = none)
  highlighted = signal(-1);

  suggestions = computed(() => {
    const q = this.debouncedQuery().trim();
    // Debug: log when suggestions computed and current debounced token
    console.log('Navbar: suggestions computed. debounced q=', q);
    if (!q) return [] as ItemWithID[];
    const lowQ = q.toLowerCase();
    const list: ItemWithID[] = this.products.map((p: Item, idx: number) => ({ ...p, id: idx }));
    const matches = list.filter((p) => this._matchesItem(p, lowQ));
    // Debug: log number of products scanned and matches found
    console.log('Navbar: productsCount=', list.length, 'matchesCount=', matches.length);
    return matches.slice(0, 6);
  });

  // Called from template when search input changes (raw keystroke)
  onSearchChange(value: string) {
    // update immediate display value
    this.search.set(value);
    // clear previously scheduled debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    // schedule new debounced update
    this.debounceTimer = setTimeout(() => {
      this.debouncedQuery.set(value);
      // reset highlighted index when query changes
      this.highlighted.set(-1);
      this.debounceTimer = null;
    }, this.debounceMs);
  }

  // Keyboard navigation handler (bind from template with (keydown))
  onKeyDown(event: KeyboardEvent) {
    const items = this.suggestions();
    if (!items || items.length === 0) return;

    const key = event.key;
    let idx = this.highlighted();
    if (key === 'ArrowDown') {
      // move down (wrap)
      idx = Math.min(idx + 1, items.length - 1);
      this.highlighted.set(idx);
      event.preventDefault();
      return;
    } else if (key === 'ArrowUp') {
      // move up
      idx = Math.max(idx - 1, 0);
      this.highlighted.set(idx);
      event.preventDefault();
      return;
    } else if (key === 'Enter') {
      // if one is highlighted, select it; otherwise if only one suggestion, select it
      const selectionIndex = this.highlighted();
      if (selectionIndex >= 0 && selectionIndex < items.length) {
        this.selectSuggestion(items[selectionIndex]);
        event.preventDefault();
        return;
      } else if (items.length === 1) {
        this.selectSuggestion(items[0]);
        event.preventDefault();
        return;
      }
    } else if (key === 'Escape') {
      // clear selection and input
      this.clearSearch();
      event.preventDefault();
      return;
    }
  }

  // When suggestion clicked or chosen by Enter
  selectSuggestion(item: ItemWithID) {
    if (item?.title) {
      // set both the visible input and the debounced query so suggestions update accordingly
      this.search.set(item.title);
      this.debouncedQuery.set(item.title);
      this.highlighted.set(-1);
      // Navigate to product page
      this.router.navigate(['/product', item.id]);
      // Clear search and blur input after navigation
      this.clearSearch();
      if (this.navSearchInput) {
        this.navSearchInput.nativeElement.blur();
      }
    }
  }

  clearSearch() {
    this.search.set('');
    this.debouncedQuery.set('');
    this.highlighted.set(-1);
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    // Optionally clear input element value directly if ViewChild is available
    if (this.navSearchInput) {
      this.navSearchInput.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  // -----------------------
  // Quick (Sunday) algorithm (case-insensitive)
  private _sundayIndexOf(text: string, pattern: string): number {
    if (!pattern) return 0;
    const txt = text;
    const pat = pattern;
    const n = txt.length;
    const m = pat.length;
    if (m > n) return -1;

    const shift = new Map<number, number>();
    for (let i = 0; i < m; i++) {
      shift.set(pat.charCodeAt(i), m - i);
    }

    let i = 0;
    while (i <= n - m) {
      let j = 0;
      while (j < m && pat.charCodeAt(j) === txt.charCodeAt(i + j)) {
        j++;
      }
      if (j === m) return i;
      const next = i + m;
      if (next >= n) return -1;
      const code = txt.charCodeAt(next);
      const s = shift.get(code) ?? m + 1;
      i += s;
    }

    return -1;
  }

  private _matchesItem(p: ItemWithID, lowPattern: string): boolean {
    const haystack = (
      (p.title ?? '') +
      ' ' +
      (p.description ?? '') +
      ' ' +
      (p.category ?? '')
    ).toLowerCase();
    return this._sundayIndexOf(haystack, lowPattern) !== -1;
  }

  // trackBy function for ngFor to improve rendering performance
  trackById(_: number, item: ItemWithID) {
    return item.id;
  }
}
