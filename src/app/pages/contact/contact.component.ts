import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/services/auth.service';
import { UsuarioService } from '../../core/auth/services/usuario.service';
import { ContactService } from '../../core/auth/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const userEmail = this.usuarioService.getUserEmail();

    this.contactForm.patchValue({
      email: userEmail
    });
    this.contactForm.patchValue({
      email: userEmail
    });
  }

    onSubmit(): void {
      if (this.contactForm.valid) {
        this.isSubmitting = true;

        const userEmail = this.usuarioService.getUserEmail(); // Pegue o e-mail diretamente do serviço

        const formData = {
          ...this.contactForm.value,
          recipientEmail: 'testeprojetowise@gmail.com',  // Destinatário fixo
          from: userEmail,  // Agora, usa o e-mail diretamente do serviço
        };

        console.log('FormData enviado:', formData);

        this.contactService.sendContactEmail(formData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showSuccessMessage = true;
            this.contactForm.reset();
            setTimeout(() => this.showSuccessMessage = false, 5000);
          },
          error: (err) => {
            console.error('Erro completo ao enviar e-mail:', err);  // Exibe o erro completo no console
            this.isSubmitting = false;
            if (err.status === 401) {
              alert('Erro de autenticação. Faça login novamente.');
            } else {
              alert('Ocorreu um erro ao enviar o e-mail. Detalhes: ' + err.message);  // Exibe a mensagem de erro completa
            }
          }
        });
      } else {
        this.markFormGroupTouched(this.contactForm);
      }
    }

  onCancel(): void {
    this.contactForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['minlength']) {
        return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
