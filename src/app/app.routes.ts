import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
    },
    {
        path: 'warehouses',
        loadComponent: () => import('./warehouse/warehouse-list/warehouse-list.component').then(m => m.WarehouseListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'warehouse/add',
        loadComponent: () => import('./warehouse/warehouse-form/warehouse-form.component').then(m => m.WarehouseFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'warehouse/edit/:id',
        loadComponent: () => import('./warehouse/warehouse-form/warehouse-form.component').then(m => m.WarehouseFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'warehouse/:id',
        loadComponent: () => import('./warehouse/warehouse-detail/warehouse-detail.component').then(m => m.WarehouseDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
