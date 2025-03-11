import { ThemeService } from '../../../core/auth/services/theme.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showProfileMenu: boolean = false;
  isAuthenticated$ = this.authService.isAuthenticated$;
  isDarkTheme: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  toggleTheme(): void {
    console.log('Antes:', document.documentElement.getAttribute('data-theme'));
    this.themeService.toggleDarkMode();
    console.log('Depois:', document.documentElement.getAttribute('data-theme'));
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
