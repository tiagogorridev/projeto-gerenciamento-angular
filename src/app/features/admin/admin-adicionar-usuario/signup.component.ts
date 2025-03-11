import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { Usuario } from '../../../core/auth/model/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  searchTerm: string = '';
  perfilFilter: string = '';
  hasUsers: boolean = false;
  filteredUsers: Usuario[] = [];
  users: Usuario[] = [];
  showNewUserModal: boolean = false;
  showDeleteModal: boolean = false;
  showReactivateModal: boolean = false;
  selectedUser: Usuario | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  currentUserId: number | null = null;
  showSelfDeleteErrorModal: boolean = false;

  inactiveUsers: Usuario[] = [];
  hasInactiveUsers: boolean = false;
  filteredInactiveUsers: Usuario[] = [];
  inactiveSearchTerm: string = '';
  loadingInactiveUsers: boolean = false;

  user: Usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmPassword: '',
    perfil: 'USUARIO',
    ativo: 'ATIVO'
  };

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.currentUserId = currentUser.id ? Number(currentUser.id) : null;
      },
      error: (error) => {
        console.error('Erro ao obter usuário atual:', error);
      }
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.users = usuarios;
        this.filteredUsers = [...this.users];
        this.hasUsers = this.users.length > 0;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.filteredUsers = this.users.filter(user => {
      const termFilter = !this.searchTerm ||
                          user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const perfilFilter = !this.perfilFilter ||
                            this.perfilFilter === 'Todos' ||
                            (this.perfilFilter === 'Administrador' && user.perfil === 'ADMIN') ||
                            (this.perfilFilter === 'Usuário' && user.perfil === 'USUARIO');

      const ativoFilter = user.ativo === 'ATIVO';

      return termFilter && perfilFilter && ativoFilter;
    });
  }

  openNewUserModal(): void {
    this.user = {
      nome: '',
      email: '',
      senha: '',
      confirmPassword: '',
      perfil: 'USUARIO',
      ativo: 'ATIVO'
    };
    this.errorMessage = '';
    this.showNewUserModal = true;
  }

  closeModal(): void {
    this.showNewUserModal = false;
    this.errorMessage = '';
  }

  openDeleteModal(usuario: Usuario): void {
    if (usuario.id === this.currentUserId) {
      this.showSelfDeleteErrorModal = true;
      return;
    }

    this.selectedUser = usuario;
    this.showDeleteModal = true;
  }

  closeSelfDeleteErrorModal(): void {
    this.showSelfDeleteErrorModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  deleteUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      if (this.selectedUser.id === this.currentUserId) {
        this.errorMessage = 'O administrador atual não pode se deletar.';
        this.closeDeleteModal();
        return;
      }

      this.usuarioService.excluirUsuario(this.selectedUser.id).subscribe({
        next: () => {
          this.successMessage = 'Usuário excluído com sucesso!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
          this.closeDeleteModal();
          this.carregarUsuarios();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.errorMessage = 'Erro ao excluir usuário. Tente novamente.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  onSubmit(userForm: NgForm) {
    if (this.user.senha !== this.user.confirmPassword) {
      return;
    }

    if (userForm.valid) {
      const novoUsuario: Usuario = {
        nome: this.user.nome,
        email: this.user.email,
        senha: this.user.senha,
        perfil: this.user.perfil,
        ativo: 'ATIVO'
      };

      this.usuarioService.cadastrarUsuario(novoUsuario).subscribe({
        next: () => {
          this.successMessage = 'Usuário cadastrado com sucesso!';
          this.errorMessage = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
          this.closeModal();
          this.carregarUsuarios();
        },
        error: (error: any) => {
          if (error.status === 400) {
            switch (error.error.message) {
              case 'Email já cadastrado':
                this.errorMessage = 'Este email já está em uso. Tente outro.';
                break;
              case 'Usuário inativo':
                this.errorMessage = 'Este email pertence a um usuário inativo. Entre em contato com o administrador.';
                break;
              default:
                this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
            }
          } else {
            this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
          }
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  openReactivateModal(): void {
    this.showReactivateModal = true;
    this.errorMessage = '';
    this.inactiveSearchTerm = '';
    this.loadInactiveUsers();
  }

  closeReactivateModal(): void {
    this.showReactivateModal = false;
    this.inactiveUsers = [];
    this.filteredInactiveUsers = [];
  }

  loadInactiveUsers(): void {
    this.loadingInactiveUsers = true;
    this.usuarioService.listarInativos().subscribe({
      next: (response: Usuario[]) => {
        this.inactiveUsers = response;
        this.filteredInactiveUsers = [...this.inactiveUsers];
        this.hasInactiveUsers = this.inactiveUsers.length > 0;
        this.loadingInactiveUsers = false;
      },
      error: (error: Error) => {
        console.error('Erro ao carregar usuários inativos:', error);
        this.loadingInactiveUsers = false;
        this.errorMessage = 'Erro ao carregar usuários inativos.';
      }
    });
  }

  filterInactiveUsers(): void {
    this.filteredInactiveUsers = this.inactiveUsers.filter(usuario =>
      usuario.nome.toLowerCase().includes(this.inactiveSearchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(this.inactiveSearchTerm.toLowerCase())
    );
  }
reactivateUser(usuario: Usuario): void {
  if (usuario && usuario.id) {
    this.usuarioService.reativarUsuario(usuario.id).subscribe({
      next: (response) => {
        this.closeReactivateModal();

        this.successMessage = 'Usuário reativado com sucesso!';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        this.carregarUsuarios();
      },
      error: (error) => {
        console.error('Erro ao reativar usuário:', error);
        this.errorMessage = 'Erro ao reativar usuário. Tente novamente.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
}
}
