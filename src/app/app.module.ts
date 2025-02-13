import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core -> Auth -> Interceptors
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';

// Core -> Layout
import { HeaderComponent } from './core/layout/header/header.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';

// Features -> Admin
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HourApprovalComponent } from './features/admin/hour-approval/hour-approval.component';
import { AdminReportsComponent } from './features/admin/admin-reports/admin-reports.component';
import { SignupComponent } from './features/admin/signup/signup.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';

// Features -> Profile
import { ProfileComponent } from './features/profile/profile.component';

// Features -> Users
import { ActivitiesComponent } from './features/users/activities/activities.component';
import { UsersDashboardComponent } from './features/users/users-dashboard/users-dashboard.component';
import { ProjectsComponent } from './features/users/projects/projects.component';
import { EditProjectsComponent } from './features/users/projects/edit-projects/edit-projects.component';
import { TimeHistoryComponent } from './features/users/time-history/time-history.component';
import { TimeTrackingComponent } from './features/users/time-tracking/time-tracking.component';

// Pages
import { ContactComponent } from './pages/contact/contact.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
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
    ProfileComponent,
    ContactComponent,
    HelpPageComponent,
    ForgotPasswordComponent,
    SignupComponent,
    HeaderComponent,
    EditProjectsComponent,
    TimeTrackingComponent,
    HourApprovalComponent,
    AdminReportsComponent,
    UserManagementComponent,
    TimeHistoryComponent,
    AdminSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // PrimeNG
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HttpClientModule,
    CalendarModule,
    BrowserAnimationsModule
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
