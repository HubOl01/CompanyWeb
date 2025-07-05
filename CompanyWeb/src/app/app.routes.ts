import { Routes } from '@angular/router';
import { AboutPage } from './pages/about-page/about-page';
import { EmployeePage } from './pages/employee-page/employee-page';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  {
    path: 'about',
    component: AboutPage,
    title: 'О компании',
  },
  {
    path: 'employees',
    component: EmployeePage,
    title: 'Сотрудники',
  },
];
