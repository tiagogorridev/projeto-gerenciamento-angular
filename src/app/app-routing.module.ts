import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard', // CORRETO ✅
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full', // Melhor prática: usar redirectTo para evitar duplicação
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
