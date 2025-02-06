import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectsComponent } from './projects/projects.component';
import { ReportsComponent } from './reports/reports.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'timesheet', component: TimesheetComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'help-page', component: HelpPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
