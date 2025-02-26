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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  }


  logout() {
    this.authService.logout().subscribe();
  }

  onSearch(event: any): void {
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
