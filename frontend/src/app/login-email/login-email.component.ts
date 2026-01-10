import { ChangeDetectionStrategy, Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-email',
  standalone: true,
  templateUrl: './login-email.component.html',
  styleUrls: ['./login-email.component.scss'],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginEmailComponent {
  @ViewChild('checkboxStayLoggedIn') checkbox!: ElementRef<HTMLInputElement>;

  toggleCheckbox() {
    if (this.checkbox) {
      this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
    }
  }
}
