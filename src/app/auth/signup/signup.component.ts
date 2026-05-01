import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  error = '';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private router: Router, private authService: AuthService, private toast: ToastService) { }

  signup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email || '';
    const password = this.form.value.password || '';

    this.authService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.error = 'Email already exists';
        return;
      }

      const userData = {
        id: Date.now(),
        email,
        password
      };


      this.authService.signup(userData).subscribe(() => {
        this.toast.show('Signup Successful');
        this.router.navigate(['/login'])
      })

    })




  }

}
