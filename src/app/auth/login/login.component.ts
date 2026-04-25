import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  error = '';


  form = new FormGroup({
    email: new FormControl('',
      [Validators.required,
      Validators.email]),

    password: new FormControl('',
      [Validators.required,
      Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {

  }


  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    const success = this.authService.login(
      email || '',
      password || ''
    );

    if (success) {
      this.router.navigate(['/warehouses']);
    } else {
      this.error = 'Invalid credentials'
    }
  }

}
