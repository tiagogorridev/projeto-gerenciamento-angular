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

  user: Usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmPassword: '',
    perfil: 'USUARIO'
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
      // Filtro de busca por nome ou email
      const termFilter = !this.searchTerm ||
                        user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por perfil
      const perfilFilter = !this.perfilFilter ||
                          this.perfilFilter === 'Todos' ||
                          (this.perfilFilter === 'Administrador' && user.perfil === 'ADMIN') ||
                          (this.perfilFilter === 'Usuário' && user.perfil === 'USUARIO');

      return termFilter && perfilFilter;
    });
  }

  openNewUserModal(): void {
    this.user = {
      nome: '',
      email: '',
      senha: '',
      confirmPassword: '',
      perfil: 'USUARIO'
    };
    this.showNewUserModal = true;
  }

  closeModal(): void {
    this.showNewUserModal = false;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    if (this.user.senha !== this.user.confirmPassword) {
      console.error('As senhas não coincidem!');
      return;
    }

    const novoUsuario: Usuario = {
      nome: this.user.nome,
      email: this.user.email,
      senha: this.user.senha,
      perfil: this.user.perfil,
      confirmPassword: this.user.confirmPassword
    };

    this.usuarioService.cadastrarUsuario(novoUsuario).subscribe({
      next: (response) => {
        console.log('Usuário cadastrado com sucesso:', response);
        this.closeModal();
        this.carregarUsuarios();
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário:', error);
      }
    });
  }

  navegarParaEdicao(id: string | number | undefined): void {
    if (id !== undefined) {
      // Convert to string if it's a number
      const idString = String(id);
      this.router.navigate(['/usuarios/editar', idString]);
    } else {
      console.error('Tentativa de navegar para edição com ID indefinido');
      // Optionally show user feedback that this action failed
    }
  }
}
