import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
