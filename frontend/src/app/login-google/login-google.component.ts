// login-google.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  template: `<p>Processing Google Login...</p>`,
})
export class LoginGoogleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // 1. Check if we just arrived back from the backend with a token
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        // SUCCESS: We have the token in the URL
        this.authService.handleOAuthLogin(token).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        // START: We are just starting the process, send user to backend
        const backendUrl = `http://localhost:5000/api/auth/google`;
        window.location.href = backendUrl;
      }
    });
  }
}
