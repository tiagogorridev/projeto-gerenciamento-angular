import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { UsuarioService } from '../../core/auth/services/usuario.service';
import { ContactService } from '../../core/auth/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
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

        const userEmail = this.usuarioService.getUserEmail();

        const formData = {
          ...this.contactForm.value,
          recipientEmail: 'testeprojetowise@gmail.com',
          from: userEmail,
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
            console.error('Erro completo ao enviar e-mail:', err);
            this.isSubmitting = false;
          }
        });
      } else {
        this.markFormGroupTouched(this.contactForm);
      }
    }

  onCancel(): void {
    const userEmail = this.usuarioService.getUserEmail();
    this.contactForm.reset();
    this.contactForm.patchValue({
      email: userEmail
    });
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
