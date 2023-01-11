import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: "", loadComponent: () => import('./contact.component').then(mod => mod.ContactComponent)},
];