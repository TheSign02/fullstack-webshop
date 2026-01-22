// login-email.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-email',
  standalone: true,
  templateUrl: './login-email.component.html',
  styleUrls: ['./login-email.component.scss'],
  imports: [RouterLink, ReactiveFormsModule], // Added ReactiveFormsModule
})
export class LoginEmailComponent {
  loginForm: FormGroup;
  @ViewChild('checkboxStayLoggedIn') checkbox!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
            this.router.navigate(['']);
          }); // Redirect after login
        },
        error: (err) => console.error('Login failed', err),
      });
    }
  }

  toggleCheckbox() {
    if (this.checkbox) {
      this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
    }
  }
}
