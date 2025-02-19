import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { AuthService } from '../../../core/auth/services/auth.service';
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
  senhaAtualInvalida: boolean = false;
  mensagemErroSenha: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private initializePersonalForm(): FormGroup {
    return this.fb.group({
      nome: [''],
      email: { value: '', disabled: true },
      perfil: { value: '', disabled: true }
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

    const userId = this.authService.getUserId();
    console.log('ID do usuário:', userId);

    if (userId) {
      this.usuarioService.getUsuarioById(Number(userId))
        .subscribe({
          next: (usuario) => {
            this.currentUser = usuario;
            this.updatePersonalForm(this.currentUser);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao carregar dados do usuário: ' + (error?.message || 'Desconhecido');
            console.error('Erro ao carregar usuário:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
    } else {
      this.errorMessage = 'ID do usuário não encontrado.';
      console.error('ID do usuário não encontrado.');
      this.loading = false;
    }
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
      this.personalForm.get('email')?.enable();
      this.personalForm.get('perfil')?.enable();

      const updatedUser: Usuario = {
        ...this.currentUser,
        nome: this.personalForm.get('nome')?.value,
        email: this.currentUser.email,
        perfil: this.currentUser.perfil,
        senha: this.currentUser.senha
      };

      this.usuarioService.updateUsuario(updatedUser)
        .pipe(finalize(() => {
          this.saving = false;
          this.personalForm.get('email')?.disable();
          this.personalForm.get('perfil')?.disable();
        }))
        .subscribe({
          next: (response) => {
            this.successMessage = 'Informações pessoais atualizadas com sucesso!';
            this.currentUser = response;
            this.updatePersonalForm(this.currentUser);
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
      this.senhaAtualInvalida = false;
      this.mensagemErroSenha = '';

      const updatedUser = {
        id: this.currentUser.id,
        senha: this.securityForm.get('novaSenha')?.value,
        senhaAtual: this.securityForm.get('senhaAtual')?.value
      };

      this.usuarioService.updateUsuario(updatedUser)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Senha atualizada com sucesso!';
            this.securityForm.reset();
            this.senhaAtualInvalida = false;
            this.mensagemErroSenha = '';
          },
          error: (error) => {
            console.error('Erro na atualização da senha:', error);
            this.senhaAtualInvalida = true;
            this.mensagemErroSenha = 'Senha atual incorreta';
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

    // Método para limpar os erros quando mudar de aba
    private clearMessages(): void {
      this.errorMessage = '';
      this.successMessage = '';
      this.senhaAtualInvalida = false;
      this.mensagemErroSenha = '';
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
