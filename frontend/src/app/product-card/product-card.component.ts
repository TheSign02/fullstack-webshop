import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Item } from '../item';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Item | null = null;
  @Input() id: number | null = null;
  constructor(private router: Router) {}

  navigateToProduct() {
    // if (this.id === null || this.id < 0) {
    this.router.navigate(['/product', this.id], { state: { product: this.product } });
    // }
  }
}
