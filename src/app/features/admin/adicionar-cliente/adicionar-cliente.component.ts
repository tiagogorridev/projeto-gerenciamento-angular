import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/auth/services/clients.service';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.scss']
})
export class AdicionarClienteComponent {
  fullName: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  onSubmit() {
    if (!this.email || !this.fullName) {
      console.error('O email e nome são obrigatórios');
      return;
    }

    console.log('Dados do cliente:', { nome_cliente: this.fullName, email_cliente: this.email });

    const novoCliente = {
      nomeCliente: this.fullName,
      emailCliente: this.email
    };

    this.clienteService.cadastrarCliente(novoCliente).subscribe({
      next: (response) => {
        console.log('Cliente criado com sucesso:', response);
        this.router.navigate(['/admin/admin-projetos']);
      },
      error: (err) => {
        console.error('Erro ao criar cliente:', err);
      }
    });
  }
}
