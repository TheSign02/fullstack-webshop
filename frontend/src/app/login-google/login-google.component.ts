import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-google',
  standalone: true,
  template: '<p>Redirecting to Google…</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginGoogleComponent implements OnInit {
  ngOnInit(): void {
    const backendOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;
    window.location.assign(`${backendOrigin}/api/auth/google`);
  }
}
