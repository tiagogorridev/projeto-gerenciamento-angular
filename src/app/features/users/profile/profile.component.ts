import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Usuario } from '../../../core/auth/services/usuario.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
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
  senhaIgualAtual = false;
  erroSenhaIgual: boolean = false;
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
      novaSenha: ['', [Validators.required, Validators.minLength(6), this.novaSenhaDiferenteValidator.bind(this)]],
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


    novaSenhaDiferenteValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (!control.value) return null;

      const senhaAtual = this.securityForm?.get('senhaAtual')?.value;
      if (senhaAtual && control.value === senhaAtual) {
        this.senhaIgualAtual = true;
        return { 'senhaIgual': true };
      }
      this.senhaIgualAtual = false;
      return null;
    }

    private passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
      const novaSenha = formGroup.get('novaSenha')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (novaSenha && confirmPassword && novaSenha !== confirmPassword) {
        return { 'passwordMismatch': true };
      }
      return null;
    }

  private onSavePersonal(): void {
    if (this.personalForm.valid && this.currentUser) {
      this.saving = true;

      const updatedUser = {
        nome: this.personalForm.get('nome')?.value,
        email: this.currentUser.email,
        perfil: this.currentUser.perfil
      };

      this.usuarioService.updatePersonalInfo({
        id: this.currentUser.id,
        ...updatedUser
      })
      .pipe(finalize(() => {
        this.saving = false;
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

      if (this.securityForm.hasError('senhaIgual') || this.senhaIgualAtual) {
        this.erroSenhaIgual = true;
        this.saving = false;
        return;
      }

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
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);

            this.securityForm.reset();
            this.senhaAtualInvalida = false;
            this.mensagemErroSenha = '';
            if (this.erroSenhaIgual) this.erroSenhaIgual = false;
          },
          error: (error) => {
            console.error('Erro na atualização da senha:', error);
            this.senhaAtualInvalida = true;
            this.mensagemErroSenha = 'Senha atual incorreta';
          }
        });
    }
  }


  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    if (!control) return false;

    if (errorName !== 'senhaIgual') {
      return control.hasError(errorName) && control.touched;
    }

    return control.hasError(errorName);
  }

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
