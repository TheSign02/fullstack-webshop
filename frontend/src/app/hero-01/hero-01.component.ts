import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-hero-01',
  standalone: true,
  templateUrl: './hero-01.component.html',
  styleUrls: ['./hero-01.component.scss'],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero01Component {}
