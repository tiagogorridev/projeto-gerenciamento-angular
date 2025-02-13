import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Páginas
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignupComponent } from './features/admin/signup/signup.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { LogoutComponent } from './pages/logout/logout.component';

// Core -> Auth -> Guards
import { AuthGuard } from './core/auth/guards/auth.guard';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { UserGuard } from './core/auth/guards/user.guard';

// Componentes de Admin
import { DashboardComponent as AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HourApprovalComponent } from './features/admin/hour-approval/hour-approval.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';
import { AdminRelatoriosComponent } from './features/admin/admin-relatorios/admin-relatorios.component';
import { AdminProjetosComponent } from './features/admin/admin-projetos/admin-projetos.component';
import { AdminAtividadesComponent } from './features/admin/admin-atividades/admin-atividades.component';

// Componentes de Usuário Comum
import { ActivitiesComponent } from './features/users/activities/activities.component';
import { UsersDashboardComponent } from './features/users/users-dashboard/users-dashboard.component';
import { ProjectsComponent } from './features/users/projects/projects.component';
import { EditProjectsComponent } from './features/users/projects/edit-projects/edit-projects.component';
import { TimeHistoryComponent } from './features/users/time-history/time-history.component';
import { TimeTrackingComponent } from './features/users/time-tracking/time-tracking.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UsersRelatoriosComponent } from './features/users/users-relatorios/users-relatorios.component';

// Rotas
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Rotas compartilhadas para usuários autenticados (tanto admin quanto usuário comum)
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'help-page', component: HelpPageComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },

  // Rotas do Administrador
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'hour-approval', component: HourApprovalComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'admin-sidebar', component: AdminSidebarComponent },
      { path: 'admin-atividades', component: AdminAtividadesComponent },
      { path: 'admin-projetos', component: AdminProjetosComponent },
      { path: 'admin-relatorios', component: AdminRelatoriosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona para o dashboard por padrão
    ],
  },

  // Rotas do Usuário Comum
  {
    path: 'user',
    canActivate: [AuthGuard, UserGuard],
    children: [
      { path: 'dashboard', component: UsersDashboardComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'edit-projects/:nome', component: EditProjectsComponent },
      { path: 'time-history', component: TimeHistoryComponent },
      { path: 'time-tracking', component: TimeTrackingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'timetracking', component: TimeTrackingComponent, canActivate: [AuthGuard] },
      { path: 'users-relatorios', component: UsersRelatoriosComponent, canActivate: [AuthGuard] },
      { path: 'users-dashboard', component: UsersDashboardComponent, canActivate: [AuthGuard] },


      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona para o dashboard por padrão
    ],
  },

  // Rota padrão para caminhos inválidos
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
