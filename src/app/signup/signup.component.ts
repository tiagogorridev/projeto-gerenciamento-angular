import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('As senhas não coincidem!');
      return;
    }

    console.log('Nome Completo:', this.fullName);
    console.log('Email:', this.email);
    console.log('Senha:', this.password);


    this.router.navigate(['/login']);
  }
}
