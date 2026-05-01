import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  message$ = new BehaviorSubject<string>('');


  show(message: string) {
    this.message$.next(message);
    setTimeout(() => this.clear(), 3000)
  }

  clear() {
    this.message$.next('');
  }

}
