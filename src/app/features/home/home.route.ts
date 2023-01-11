import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: "", loadComponent: () => import('./home.component').then(mod => mod.HomeComponent)},
];