import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormInputComponent],
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

    this.authService.login(
      email || '',
      password || ''
    ).subscribe((success) => {
      if (success) {
        this.router.navigate(['/warehouses']);
      } else {
        this.error = 'Invalid credentials'
      }
    })


  }

}
