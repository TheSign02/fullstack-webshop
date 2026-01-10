import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-passwd',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-passwd.component.html',
  styleUrl: './reset-passwd.component.scss',
})
export class ResetPasswd {}
