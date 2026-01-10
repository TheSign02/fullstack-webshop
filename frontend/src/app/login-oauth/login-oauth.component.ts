import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-login-oauth',
  standalone: true,
  templateUrl: './login-oauth.component.html',
  styleUrls: ['./login-oauth.component.scss'],
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOauthComponent {}
