import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoaderService } from './core/services/loader.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {


  constructor(public authService: AuthService,
    private router: Router,
    public loader: LoaderService,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

}
