import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: "", loadComponent: () => import('./prayers.component').then(mod => mod.PrayersComponent)},
];