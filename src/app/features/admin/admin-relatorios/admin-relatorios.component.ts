import { UsuarioService } from './../../../core/auth/services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { TarefaService } from 'src/app/core/auth/services/tarefa.service';

import { Projeto } from '../../../core/auth/services/projeto.model';
import { Tarefa } from '../../../core/auth/services/tarefa.model';



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
  tarefas: Tarefa[] = [];
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
  activeTab: string = 'projetos';

  totalTarefas: number = 0;
  tarefasConcluidas: number = 0;
  tarefasEmAndamento: number = 0;
  horasEstimadasTarefas: number = 0;
  horasRegistradasTarefas: number = 0;
  selectedStatusTarefa: string = '';
  selectedPrioridadeTarefa: string = '';
  selectedUsuarioTarefa: string = '';
  selectedDataInicioTarefa: string = '';
  selectedDataFimTarefa: string = '';


  tarefasFiltradas: Tarefa[] = [];

  constructor(
    private projectsService: ProjectsService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private tarefaService: TarefaService,
  ) {}

  ngOnInit(): void {
    this.carregarProjetos();
    this.carregarClientes();
    this.carregarUsuarios();
    this.carregarTarefas();
  }

  carregarProjetos(): void {
    this.projectsService.getProjetos().subscribe((projetos) => {
      this.projetos = projetos;
      this.aplicarFiltros();
    });
  }

  carregarTarefas(): void {
    this.tarefaService.getTodasTarefas().subscribe(
      (tarefas) => {
        this.tarefas = tarefas;
        this.atualizarResumoTarefas();  // Atualiza o resumo de tarefas
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
      }
    );
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

  aplicarFiltrosTarefas(): void {
    this.tarefasFiltradas = this.tarefas.filter((tarefa) => {
      const dataInicioTarefa = new Date(tarefa.dataInicio);
      const dataFimTarefa = new Date(tarefa.dataFim);
      const dataInicioFiltro = this.selectedDataInicioTarefa ? new Date(this.selectedDataInicioTarefa) : null;
      const dataFimFiltro = this.selectedDataFimTarefa ? new Date(this.selectedDataFimTarefa) : null;

      return (
        (!this.selectedStatusTarefa || tarefa.status === this.selectedStatusTarefa) &&
        (!this.selectedUsuarioTarefa || tarefa.usuarioResponsavel.id === Number(this.selectedUsuarioTarefa)) &&
        (!dataInicioFiltro || dataInicioTarefa >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimTarefa <= dataFimFiltro)
      );
    });

    this.atualizarResumoTarefas(); // Atualiza o resumo das tarefas filtradas
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

  atualizarResumoTarefas(): void {
    this.totalTarefas = this.tarefas.length;
    this.tarefasConcluidas = this.tarefas.filter(tarefa => tarefa.status === 'CONCLUIDA').length;
    this.tarefasEmAndamento = this.tarefas.filter(tarefa => tarefa.status === 'EM_ANDAMENTO').length;
    this.horasEstimadasTarefas = this.tarefas.reduce((total, tarefa) => total + (tarefa.horasEstimadas ?? 0), 0);
    this.horasRegistradasTarefas = this.tarefas.reduce((total, tarefa) => total + (tarefa.tempoRegistrado ?? 0), 0);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  limparFiltros(): void {
    this.selectedCliente = '';
    this.selectedUsuario = '';
    this.selectedStatus = '';
    this.selectedPrioridade = '';
    this.selectedDataInicio = '';
    this.selectedDataFim = '';
    this.aplicarFiltros();
  }
}
