import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  showProfileMenu: boolean = false;
  isAuthenticated$ = this.authService.isAuthenticated$;
  isDarkTheme: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkTheme = savedTheme === 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    console.log('Tema alterado para:', theme);
  }


  logout() {
    this.authService.logout().subscribe();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    const profileElement = event.target.closest('.user-profile');
    if (!profileElement && this.showProfileMenu) {
      this.showProfileMenu = false;
    }
  }
}
