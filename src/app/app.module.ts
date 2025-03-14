import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Core -> Auth -> Interceptors
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';

// Core -> Layout
import { HeaderComponent } from './features/users/user-header/header.component';
import { SidebarComponent } from './features/users/user-sidebar/sidebar.component';

// Features -> Admin
import { AdicionarClienteComponent } from './features/admin/admin-gerenciar-cliente/adicionar-cliente.component';
import { AdminHeaderComponent } from './features/admin/admin-header/admin-header.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { AdminProjetosComponent } from './features/admin/admin-projetos/admin-projetos.component';
import { AdminRelatoriosComponent } from './features/admin/admin-relatorios/admin-relatorios.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';
import { AdminTarefaComponent } from './features/admin/admin-tarefa/admin-tarefa.component';
import { DashboardComponent } from './features/admin/admin-dashboard/dashboard.component';
import { EditProjectsComponent } from './features/admin/admin-editar-projeto/edit-projects.component';
import { HelpPageAdminComponent } from './features/admin/admin-help-page/help-page-admin.component';
import { HourApprovalComponent } from './features/admin/admin-aprovar-horas/hour-approval.component';
import { SignupComponent } from './features/admin/admin-gerenciar-usuario/signup.component';

// Features -> Users
import { AboutProjectsComponent } from './features/users/user-sobre-projetos/about-projects.component';
import { HelpPageComponent } from './features/users/user-help-page/help-page.component';
import { ProfileComponent } from './features/users/user-profile/profile.component';
import { ProjectsComponent } from './features/users/user-projetos/projects.component';
import { TimeHistoryComponent } from './features/users/user-historico-horas/time-history.component';
import { TimeTrackingComponent } from './features/users/user-lancar-horas/time-tracking.component';
import { UsersDashboardComponent } from './features/users/user-dashboard/users-dashboard.component';
import { UsersRelatoriosComponent } from './features/users/user-relatorio/users-relatorios.component';

// Pages
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';

// HTTP
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Outros
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ThemeService } from './core/auth/services/theme.service';


@NgModule({
  declarations: [
    // Core
    AppComponent,
    HeaderComponent,
    SidebarComponent,

    // Features -> Admin
    DashboardComponent,
    UsersDashboardComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminProfileComponent,
    AdminRelatoriosComponent,
    AdminProjetosComponent,
    AdminTarefaComponent,
    AdminRelatoriosComponent,
    AdicionarClienteComponent,
    EditProjectsComponent,
    HourApprovalComponent,
    SignupComponent,
    HelpPageAdminComponent,

    // Features -> Users
    ProjectsComponent,
    ProfileComponent,
    TimeTrackingComponent,
    TimeHistoryComponent,
    AboutProjectsComponent,
    UsersRelatoriosComponent,
    HelpPageComponent,

    // Pages
    ContactComponent,
    LoginComponent,
    LogoutComponent,
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
    ProgressSpinnerModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CurrencyPipe,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
