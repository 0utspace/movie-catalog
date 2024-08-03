import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  login() {
    if (this.username.trim().length < 1 || this.password.trim().length < 1) {
      this.errorMessage = 'User info is required.';
    } else {
      this.errorMessage = '';
      let res: number = this.authService.login(this.username, this.password)
      if (res === 200) {
        this.router.navigate(['home']);
      } else if (res == 403) {
        this.errorMessage = 'Invalid login or password.'
      }
    }
  }
}
