import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ProjectsComponent } from './projects/projects.component';
import { ReportsComponent } from './reports/reports.component';

// Componentes do Administrador
import { DashboardComponent as AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ActivitiesComponent } from './admin/activities/activities.component';

// Componentes do Usuário Comum
import { ProfileComponent } from './user/profile/profile.component';
import { HelpPageComponent } from './user/help-page/help-page.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Rotas do Administrador
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Rotas do Usuário Comum
  {
    path: 'user',
    canActivate: [AuthGuard, UserGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'help-page', component: HelpPageComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },

  // Rotas acessíveis para ambos (Usuário autenticado)
  { path: 'timesheet', component: TimesheetComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },

  // Rota Padrão (Caso o usuário acesse um caminho inválido)
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
