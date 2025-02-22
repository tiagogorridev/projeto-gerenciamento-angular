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

  navegarParaEdicao(clienteId: number): void {
    if (clienteId) {
      this.router.navigate(['/admin/editar-cliente', clienteId]);
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.clienteService.cadastrarCliente(this.client).subscribe({
        next: (response) => {
          console.log('Cliente criado com sucesso:', response);
          this.closeModal();
          this.loadClients();
        },
        error: (error: Error) => {
          console.error('Erro ao criar cliente:', error);
        }
      });
    }
  }
}
