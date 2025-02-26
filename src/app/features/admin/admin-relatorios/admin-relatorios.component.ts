import { UsuarioService } from './../../../core/auth/services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';
import { ClienteService } from '../../../core/auth/services/clients.service';

@Component({
  selector: 'app-admin-relatorios',
  templateUrl: './admin-relatorios.component.html',
  styleUrls: ['./admin-relatorios.component.scss']
})

export class AdminRelatoriosComponent implements OnInit {
  projetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];
  clientes: any[] = [];
  usuarios: any[] = [];
  selectedCliente: string = '';
  selectedUsuario: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';
  totalProjetos: number = 0;
  horasEstimadas: number = 0;
  tempoRegistrado: number = 0;
  custoEstimado: number = 0;
  custoTrabalhado: number = 0;
  selectedDataInicio: string = '';
  selectedDataFim: string = '';

  constructor(
    private projectsService: ProjectsService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarProjetos();
    this.carregarClientes();
    this.carregarUsuarios();
  }

  carregarProjetos(): void {
    this.projectsService.getProjetos().subscribe((projetos) => {
      this.projetos = projetos;
      this.aplicarFiltros();
    });
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  aplicarFiltros(): void {
    this.projetosFiltrados = this.projetos.filter((projeto) => {
      const dataInicioProjeto = new Date(projeto.dataInicio);
      const dataFimProjeto = new Date(projeto.dataFim);
      const dataInicioFiltro = this.selectedDataInicio ? new Date(this.selectedDataInicio) : null;
      const dataFimFiltro = this.selectedDataFim ? new Date(this.selectedDataFim) : null;
      return (
        (!this.selectedCliente || projeto.cliente.id === Number(this.selectedCliente)) &&
        (!this.selectedUsuario || projeto.usuarioResponsavel.id === Number(this.selectedUsuario)) &&
        (!this.selectedStatus || projeto.status === this.selectedStatus) &&
        (!this.selectedPrioridade || projeto.prioridade === this.selectedPrioridade) &&
        (!dataInicioFiltro || dataInicioProjeto >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimProjeto <= dataFimFiltro)
      );
    });
    this.atualizarResumo();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANEJADO': return 'status-planejado';
      case 'EM_ANDAMENTO': return 'status-em-andamento';
      case 'CONCLUIDO': return 'status-concluido';
      case 'CANCELADO': return 'status-cancelado';
      default: return 'status-padrao';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'ALTA': return 'prioridade-alta';
      case 'MEDIA': return 'prioridade-media';
      case 'BAIXA': return 'prioridade-baixa';
      default: return 'prioridade-padrao';
    }
  }

  atualizarResumo(): void {
    this.totalProjetos = this.projetosFiltrados.length;
    this.horasEstimadas = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.horasEstimadas ?? 0), 0);
    this.tempoRegistrado = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.tempoRegistrado ?? 0), 0);
    this.custoEstimado = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.custoEstimado ?? 0), 0);
    this.custoTrabalhado = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.custoTrabalhado ?? 0), 0);
  }
}
