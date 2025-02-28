import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
  erroSenhaIgual: boolean = false;
  senhaIgualAtual = false;


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
      novaSenha: ['', [Validators.required, Validators.minLength(6), this.novaSenhaDiferenteValidator.bind(this)]], // Validação personalizada
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private loadUserData(): void {
    this.loading = true;
    const userId = this.authService.getUserId();
    if (userId) {
      this.usuarioService.getUsuarioById(Number(userId))
        .subscribe({
          next: (usuario) => {
            this.currentUser = usuario;
            this.updatePersonalForm(this.currentUser);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao carregar dados do usuário: ' + (error?.message || 'Desconhecido');
          },
          complete: () => {
            this.loading = false;
          }
        });
    } else {
      this.errorMessage = 'ID do usuário não encontrado.';
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

      // Verifica se a nova senha é igual à antiga
      if (this.securityForm.hasError('senhaIgual')) {
        this.erroSenhaIgual = true;
        this.saving = false;
        return; // Impede o envio se as senhas forem iguais
      }

      // Caso contrário, tenta atualizar a senha
      this.usuarioService.updateUsuario(updatedUser)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Senha atualizada com sucesso!';
            this.securityForm.reset();
            this.erroSenhaIgual = false;  // Reseta o erro quando a senha for alterada com sucesso
            this.senhaAtualInvalida = false;
            this.mensagemErroSenha = '';
          },
          error: (error) => {
            this.senhaAtualInvalida = true;
            this.mensagemErroSenha = 'Senha atual incorreta';
          }
        });
    }
  }

  novaSenhaDiferenteValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const senhaAtual = this.securityForm?.get('senhaAtual')?.value;
    if (control.value === senhaAtual) {
      return { 'senhaIgual': true };  // Retorna erro se a senha for igual
    }
    return null;  // Se não for igual, não há erro
  }

  private passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const novaSenha = formGroup.get('novaSenha')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (novaSenha && confirmPassword && novaSenha !== confirmPassword) {
      return { 'passwordMismatch': true };  // Erro se as senhas não coincidirem
    }
    return null;
  }

  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
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
