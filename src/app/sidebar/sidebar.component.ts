import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe();
  }
}
