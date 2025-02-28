import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService, Cliente } from '../../../core/auth/services/clients.service';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.scss']
})

export class AdicionarClienteComponent implements OnInit {
  clients: Cliente[] = [];
  filteredClients: Cliente[] = [];
  hasClients: boolean = false;

  searchTerm: string = '';
  statusFilter: string = '';

  showNewClientModal: boolean = false;

  client: { nome: string, email: string, status: 'ATIVO' | 'INATIVO' } = {
    nome: '',
    email: '',
    status: 'ATIVO'
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clienteService.listarClientes().subscribe({
      next: (response: Cliente[]) => {
        this.clients = response.filter(cliente => cliente.status === 'ATIVO');
        this.hasClients = this.clients.length > 0;
        this.filterClients();
      },
      error: (error: Error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(cliente => {
      const matchesSearch = cliente.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            cliente.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter ? cliente.status === this.statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }

  openNewClientModal(): void {
    this.showNewClientModal = true;
  }

  closeModal(): void {
    this.showNewClientModal = false;
    this.client = {
      nome: '',
      email: '',
      status: 'ATIVO'
    };
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.clienteService.cadastrarCliente(this.client).subscribe({
        next: (response) => {
          this.successMessage = 'Cliente criado com sucesso!';
          this.errorMessage = '';
          this.closeModal();
          this.loadClients();
        },
        error: (error: Error) => {
          console.error('Erro ao criar cliente:', error);
          this.errorMessage = 'Erro ao criar cliente. Tente novamente.';
          this.successMessage = '';
        }
      });
    }
  }

  confirmarExclusao(clienteId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.excluirCliente(clienteId).subscribe({
        next: () => {
          this.successMessage = 'Cliente excluído com sucesso!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
          this.loadClients();
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.errorMessage = 'Erro ao excluir cliente. Tente novamente.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }
}
