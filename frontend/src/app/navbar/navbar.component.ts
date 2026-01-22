import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Added Router
import { httpResource } from '@angular/common/http';
import { Item, ItemWithID, ResponseItems } from '../item';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // Added implements OnDestroy
  @ViewChild('navSearchInput') navSearchInput?: ElementRef<HTMLInputElement>; // Added ViewChild

  private authService = inject(AuthService);

  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;

  constructor(private router: Router) {} // Added constructor and injected Router

  onLogout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log('Logout successful', res);
        this.router.navigate(['']); // Redirect after login
      },
      error: (err) => console.error('Logout failed', err),
    });
    this.router.navigate(['/login']);
  }

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

  get list(): ItemWithID[] {
    return this.products.map((p: Item, idx: number) => ({ ...p, id: idx }));
  }

  // idea: https://www.mbloging.com/post/searchable-dropdown-javascript-dynamic-data

  filteredItems: ItemWithID[] = [];
  searchText: string = '';
  showDropdown: boolean = false;

  filterItems() {
    const query = this.searchText.toLowerCase().trim();

    if (!query) {
      this.filteredItems = [];
      this.showDropdown = false;
      return;
    }

    this.filteredItems = this.list
      .filter((product) => product.title.toLowerCase().startsWith(query))
      .filter((value, index, self) => index === self.findIndex((t) => t.title === value.title));

    this.showDropdown = this.filteredItems.length > 0;
  }

  selectItem(value: ItemWithID): void {
    this.searchText = '';
    this.showDropdown = false;
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', value.id], { state: { product: value } });
    });
  }

  trackById(_: number, item: ItemWithID) {
    return item.id;
  }
}
