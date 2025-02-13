import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';


import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectsComponent } from './projects/projects.component';
import { ActivitiesComponent } from './admin/activities/activities.component';
import { ReportsComponent } from './reports/reports.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { HelpPageComponent } from './user/help-page/help-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { EditProjectsComponent } from './projects/edit-projects/edit-projects.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    ProjectsComponent,
    ActivitiesComponent,
    ReportsComponent,
    TimesheetComponent,
    ProfileComponent,
    ContactComponent,
    HelpPageComponent,
    ForgotPasswordComponent,
    SignupComponent,
    HeaderComponent,
    EditProjectsComponent,
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
