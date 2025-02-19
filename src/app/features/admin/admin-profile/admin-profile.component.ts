import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { Usuario } from '../../../core/auth/services/usuario.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  activeTab: string = 'personal';
  loading: boolean = false;
  saving: boolean = false;
  personalForm: FormGroup = this.initializePersonalForm();
  securityForm: FormGroup = this.initializeSecurityForm();
  currentUser: Usuario | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private initializePersonalForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['ADMIN', [Validators.required]]
    });
  }

  private initializeSecurityForm(): FormGroup {
    return this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private loadUserData(): void {
    this.loading = true;
    this.usuarioService.getUsuarios()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (usuarios) => {
          if (usuarios.length > 0) {
            this.currentUser = usuarios[0];
            this.updatePersonalForm(this.currentUser);
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar dados do usuário: ' + error.message;
          console.error('Erro ao carregar usuário:', error);
        }
      });
  }

  private updatePersonalForm(usuario: Usuario): void {
    this.personalForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  onSaveChanges(): void {
    if (this.activeTab === 'personal') {
      this.onSavePersonal();
    } else if (this.activeTab === 'security') {
      this.onChangePassword();
    }
  }

  private onSavePersonal(): void {
    if (this.personalForm.valid && this.currentUser) {
      this.saving = true;
      const updatedUser: Usuario = {
        ...this.currentUser,
        ...this.personalForm.value,
        senha: this.currentUser.senha
      };

      this.usuarioService.cadastrarUsuario(updatedUser)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (response) => {
            this.successMessage = 'Informações pessoais atualizadas com sucesso!';
            this.currentUser = response;
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar informações: ' + error.message;
            console.error('Erro na atualização:', error);
          }
        });
    }
  }

  private onChangePassword(): void {
    if (this.securityForm.valid && this.currentUser) {
      this.saving = true;
      const updatedUser: Usuario = {
        ...this.currentUser,
        senha: this.securityForm.get('novaSenha')?.value,
        confirmPassword: this.securityForm.get('confirmPassword')?.value
      };

      this.usuarioService.cadastrarUsuario(updatedUser)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Senha atualizada com sucesso!';
            this.securityForm.reset();
          },
          error: (error) => {
            this.errorMessage = 'Erro ao atualizar senha: ' + error.message;
            console.error('Erro na atualização da senha:', error);
          }
        });
    }
  }

  private passwordMatchValidator(group: FormGroup): null | { passwordMismatch: true } {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return novaSenha === confirmPassword ? null : { passwordMismatch: true };
  }

  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  get isPersonalFormDirty(): boolean {
    return this.personalForm.dirty;
  }

  get isSecurityFormDirty(): boolean {
    return this.securityForm.dirty;
  }

  get canSavePersonal(): boolean {
    return this.personalForm.valid && this.isPersonalFormDirty && !this.saving;
  }

  get canSaveSecurity(): boolean {
    return this.securityForm.valid && this.isSecurityFormDirty && !this.saving;
  }

  onCancel(): void {
    if (this.activeTab === 'personal') {
      this.onCancelPersonal();
    } else if (this.activeTab === 'security') {
      this.onCancelSecurity();
    }
  }

  private onCancelPersonal(): void {
    if (this.currentUser) {
      this.updatePersonalForm(this.currentUser);
    }
    this.personalForm.markAsPristine();
    this.clearMessages();
  }

  private onCancelSecurity(): void {
    this.securityForm.reset();
    this.clearMessages();
  }
}
