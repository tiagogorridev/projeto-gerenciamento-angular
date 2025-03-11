import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Páginas
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './features/admin/signup/signup.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HelpPageComponent } from './features/users/help-page/help-page.component';
import { LogoutComponent } from './pages/logout/logout.component';

// Core -> Auth -> Guards
import { AuthGuard } from './core/auth/guards/auth.guard';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { UserGuard } from './core/auth/guards/user.guard';

// Componentes de Admin
import { DashboardComponent as AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HourApprovalComponent } from './features/admin/hour-approval/hour-approval.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';
import { AdminRelatoriosComponent } from './features/admin/admin-relatorios/admin-relatorios.component';
import { AdminProjetosComponent } from './features/admin/admin-projetos/admin-projetos.component';
import { HelpPageAdminComponent } from './features/admin/help-page-admin/help-page-admin.component';
import { AdminTarefaComponent } from './features/admin/admin-tarefa/admin-tarefa.component';
import { EditProjectsComponent } from './features/admin/edit-projects/edit-projects.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { AdminHeaderComponent } from './features/admin/admin-header/admin-header.component';
import { AdicionarClienteComponent } from './features/admin/adicionar-cliente/adicionar-cliente.component';

// Componentes de Usuário
import { Header } from 'primeng/api';
import { UsersDashboardComponent } from './features/users/users-dashboard/users-dashboard.component';
import { ProjectsComponent } from './features/users/projects/projects.component';
import { TimeHistoryComponent } from './features/users/time-history/time-history.component';
import { TimeTrackingComponent } from './features/users/time-tracking/time-tracking.component';
import { UsersRelatoriosComponent } from './features/users/users-relatorios/users-relatorios.component';
import { ProfileComponent } from './features/users/profile/profile.component';
import { AboutProjectsComponent } from './features/users/about-projects/about-projects.component';

// Rotas Compartilhadas
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },

  // Rotas do Administrador
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'hour-approval', component: HourApprovalComponent },
      { path: 'admin-sidebar', component: AdminSidebarComponent },
      { path: 'admin-header', component: AdminHeaderComponent },
      { path: 'admin-projetos', component: AdminProjetosComponent },
      { path: 'admin-relatorios', component: AdminRelatoriosComponent },
      { path: 'admin-profile', component: AdminProfileComponent },
      { path: 'edit-projects/:id', component: EditProjectsComponent },
      { path: 'edit-projects/:idprojeto/:idtarefa', component: AdminTarefaComponent },
      { path: 'adicionar-cliente', component: AdicionarClienteComponent },
      { path: 'help-page-admin', component: HelpPageAdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Rotas do Usuário
  {
    path: 'user',
    canActivate: [AuthGuard, UserGuard],
    children: [
      { path: 'dashboard', component: UsersDashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'about-projects/:id', component: AboutProjectsComponent },
      { path: 'edit-projects/:nome', component: EditProjectsComponent },
      { path: 'time-history', component: TimeHistoryComponent },
      { path: 'time-tracking', component: TimeTrackingComponent },
      { path: 'timetracking', component: TimeTrackingComponent, canActivate: [AuthGuard] },
      { path: 'users-relatorios', component: UsersRelatoriosComponent, canActivate: [AuthGuard] },
      { path: 'users-dashboard', component: UsersDashboardComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'header', component: Header, canActivate: [AuthGuard] },
      { path: 'help-page', component: HelpPageComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
