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

  // Clientes inativos para o modal de reativação
  inactiveClients: Cliente[] = [];
  hasInactiveClients: boolean = false;
  filteredInactiveClients: Cliente[] = [];
  inactiveSearchTerm: string = '';
  loadingInactiveClients: boolean = false;

  searchTerm: string = '';
  statusFilter: string = '';

  showNewClientModal: boolean = false;
  showDeleteModal: boolean = false;
  showReactivateModal: boolean = false;
  selectedClient: Cliente | null = null;

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
        this.clients = response;
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
      const matchesStatus = this.statusFilter === '' ||
                            this.statusFilter === 'Todos' ||
                            cliente.status === this.statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }

  openNewClientModal(): void {
    this.showNewClientModal = true;
    this.errorMessage = '';
    this.client = {
      nome: '',
      email: '',
      status: 'ATIVO'
    };
  }

  closeModal(): void {
    this.showNewClientModal = false;
    this.errorMessage = '';
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
        error: (error: any) => {
          if (error.status === 400) {
            switch (error.error.message) {
              case 'Email já cadastrado':
                this.errorMessage = 'Este email já está em uso. Tente outro.';
                break;
              case 'Cliente inativo':
                this.errorMessage = 'Este email pertence a um cliente inativo. Entre em contato com o administrador.';
                break;
              default:
                this.errorMessage = 'Erro ao criar cliente. Tente novamente.';
            }
          } else {
            this.errorMessage = 'Erro ao criar cliente. Tente novamente.';
          }
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  openDeleteModal(cliente: Cliente): void {
    this.selectedClient = cliente;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedClient = null;
  }

  deleteClient(): void {
    if (this.selectedClient && this.selectedClient.id) {
      this.clienteService.excluirCliente(this.selectedClient.id).subscribe({
        next: () => {
          this.successMessage = 'Cliente excluído com sucesso!';
          this.closeDeleteModal();
          this.loadClients();
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.errorMessage = 'Erro ao excluir cliente. Tente novamente.';
        }
      });
    }
  }

  // Métodos para o modal de reativação de clientes
  openReactivateModal(): void {
    this.showReactivateModal = true;
    this.errorMessage = '';
    this.inactiveSearchTerm = '';
    this.loadInactiveClients();
  }

  closeReactivateModal(): void {
    this.showReactivateModal = false;
    this.inactiveClients = [];
    this.filteredInactiveClients = [];
  }

  loadInactiveClients(): void {
    this.loadingInactiveClients = true;
    this.clienteService.listarInativos().subscribe({
      next: (response: Cliente[]) => {
        this.inactiveClients = response;
        this.filteredInactiveClients = [...this.inactiveClients];
        this.hasInactiveClients = this.inactiveClients.length > 0;
        this.loadingInactiveClients = false;
      },
      error: (error: Error) => {
        console.error('Erro ao carregar clientes inativos:', error);
        this.loadingInactiveClients = false;
        this.errorMessage = 'Erro ao carregar clientes inativos.';
      }
    });
  }

  filterInactiveClients(): void {
    this.filteredInactiveClients = this.inactiveClients.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.inactiveSearchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(this.inactiveSearchTerm.toLowerCase())
    );
  }

  reactivateClient(cliente: Cliente): void {
    if (cliente && cliente.id) {
      this.clienteService.reativarCliente(cliente.id).subscribe({
        next: () => {
          // Remove o cliente da lista de inativos
          this.inactiveClients = this.inactiveClients.filter(c => c.id !== cliente.id);
          this.filteredInactiveClients = this.filteredInactiveClients.filter(c => c.id !== cliente.id);
          this.hasInactiveClients = this.inactiveClients.length > 0;

          // Recarregar a lista de clientes ativos
          this.loadClients();

          this.successMessage = `Cliente ${cliente.nome} reativado com sucesso!`;

          // Fechar o modal se não houver mais clientes inativos
          if (this.inactiveClients.length === 0) {
            this.closeReactivateModal();
          }
        },
        error: (error) => {
          console.error('Erro ao reativar cliente:', error);
          this.errorMessage = 'Erro ao reativar cliente. Tente novamente.';
        }
      });
    }
  }
}
