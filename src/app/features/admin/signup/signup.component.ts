import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { Usuario } from '../../../core/auth/services/usuario.model';
import { NgForm } from '@angular/forms';

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
  selectedUser: Usuario | null = null;


  errorMessage: string = '';
  successMessage: string = '';

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
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
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
    this.showNewUserModal = true;
  }

  closeModal(): void {
    this.showNewUserModal = false;
  }

  openDeleteModal(usuario: Usuario): void {
    this.selectedUser = usuario;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  deleteUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.usuarioService.excluirUsuario(this.selectedUser.id).subscribe({
        next: () => {
          console.log('Usuário excluído com sucesso');
          this.closeDeleteModal();
          this.carregarUsuarios();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
        }
      });
    }
  }
  onSubmit(form: any): void {
    if (form.valid) {
      const novoUsuario: Usuario = {
        nome: this.user.nome,
        email: this.user.email,
        senha: this.user.senha,
        perfil: this.user.perfil,
        confirmPassword: this.user.confirmPassword,
        ativo: 'ATIVO'
      };

      this.usuarioService.cadastrarUsuario(novoUsuario).subscribe({
        next: (response) => {
          this.successMessage = 'Usuário cadastrado com sucesso!';
          this.errorMessage = '';
          this.closeModal();
          this.carregarUsuarios();
        },
        error: (error: any) => {
          console.error('Erro ao cadastrar usuário:', error);
          if (error.status === 400 && error.error.message === 'Email já cadastrado') {
            this.errorMessage = 'Este email já está em uso. Tente outro.';
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
}
