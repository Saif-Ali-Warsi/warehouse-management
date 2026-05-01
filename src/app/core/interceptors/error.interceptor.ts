import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {

      if (error.status === 401) {
        toast.show('Unauthorized. Please login again.');
        router.navigate(['/login']);
      }

      if (error.status === 404) {
        toast.show('Resources not found.');
      }

      if (error.status === 500) {
        toast.show('Internal server error.');
      }

      return throwError(() => error)

    })
  )

};
