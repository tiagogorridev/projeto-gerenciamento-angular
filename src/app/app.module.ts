import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown'; // Importe o módulo
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Core -> Auth -> Interceptors
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';

// Core -> Layout
import { HeaderComponent } from './core/layout/header/header.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';

// Features -> Admin
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HourApprovalComponent } from './features/admin/hour-approval/hour-approval.component';
import { SignupComponent } from './features/admin/signup/signup.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';

// Features -> Users
import { ActivitiesComponent } from './features/users/activities/activities.component';
import { UsersDashboardComponent } from './features/users/users-dashboard/users-dashboard.component';
import { ProjectsComponent } from './features/users/projects/projects.component';
import { EditProjectsComponent } from './features/admin/edit-projects/edit-projects.component';
import { TimeHistoryComponent } from './features/users/time-history/time-history.component';
import { TimeTrackingComponent } from './features/users/time-tracking/time-tracking.component';

// Pages
import { ContactComponent } from './pages/contact/contact.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HelpPageComponent } from './features/users/help-page/help-page.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';

// Reports
import { ReportsComponent } from './reports/reports.component';

// HTTP
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminAtividadesComponent } from './features/admin/admin-atividades/admin-atividades.component';
import { AdminRelatoriosComponent } from './features/admin/admin-relatorios/admin-relatorios.component';
import { AdminProjetosComponent } from './features/admin/admin-projetos/admin-projetos.component';
import { UsersRelatoriosComponent } from './features/users/users-relatorios/users-relatorios.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { ProfileComponent } from './features/users/profile/profile.component';
import { AdminHeaderComponent } from './features/admin/admin-header/admin-header.component';
import { AdicionarClienteComponent } from './features/admin/adicionar-cliente/adicionar-cliente.component';
import { AboutProjectsComponent } from './features/users/about-projects/about-projects.component';
import { HelpPageAdminComponent } from './features/admin/help-page-admin/help-page-admin.component';
import { AdminTarefaComponent } from './features/admin/admin-tarefa/admin-tarefa.component';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
    UsersDashboardComponent,
    SidebarComponent,
    ProjectsComponent,
    ActivitiesComponent,
    ReportsComponent,
    ContactComponent,
    HelpPageComponent,
    HelpPageAdminComponent,
    ForgotPasswordComponent,
    SignupComponent,
    HeaderComponent,
    EditProjectsComponent,
    TimeTrackingComponent,
    HourApprovalComponent,
    UserManagementComponent,
    TimeHistoryComponent,
    AdminSidebarComponent,
    AdminAtividadesComponent,
    AdminRelatoriosComponent,
    AdminProjetosComponent,
    UsersRelatoriosComponent,
    AdminProfileComponent,
    ProfileComponent,
    AdminHeaderComponent,
    AdicionarClienteComponent,
    AboutProjectsComponent,
    AdminTarefaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // PrimeNG
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    AvatarModule,
    BadgeModule,
    DropdownModule,
    TagModule,
    ProgressBarModule,
    HttpClientModule,
    CalendarModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,           // Import for p-table
    ProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
