import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { TarefaService } from 'src/app/core/auth/services/tarefa.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Projeto } from '../../../core/auth/model/projeto.model';
import { Tarefa } from '../../../core/auth/model/tarefa.model';
import { Usuario } from '../../../core/auth/model/usuario.model';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UsuarioService } from 'src/app/core/auth/services/usuario.service';

@Component({
  selector: 'app-users-relatorios',
  templateUrl: './users-relatorios.component.html',
  styleUrls: ['./users-relatorios.component.scss']
})

export class UsersRelatoriosComponent implements OnInit {
  usuarioAtual: Usuario | null = null;
  meusProjetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];
  minhasTarefas: Tarefa[] = [];
  tarefasFiltradas: Tarefa[] = [];
  clientes: any[] = [];
  tarefasDosProjetos: Tarefa[] = [];

  selectedCliente: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';
  selectedDataInicio: string = '';
  selectedDataFim: string = '';

  selectedProjetoTarefa: string = '';
  selectedClienteTarefa: string = '';
  selectedStatusTarefa: string = '';
  selectedPrioridadeTarefa: string = '';
  selectedDataInicioTarefa: string = '';
  selectedDataFimTarefa: string = '';

  totalProjetos: number = 0;
  projetosEmAndamento: number = 0;
  projetosConcluidos: number = 0;
  horasEstimadas: number = 0;
  tempoRegistrado: number = 0;

  totalTarefas: number = 0;
  tarefasConcluidas: number = 0;
  tarefasEmAndamento: number = 0;
  horasEstimadasTarefas: number = 0;
  horasRegistradasTarefas: number = 0;

  activeTab: string = 'projetos';

  constructor(
    private projectsService: ProjectsService,
    private clienteService: ClienteService,
    private tarefaService: TarefaService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarioAtual().subscribe(usuario => {
      this.usuarioAtual = usuario;
      if (this.usuarioAtual && this.usuarioAtual.id) {
        this.carregarDadosDoUsuario(this.usuarioAtual.id);
      }
    });

    this.carregarClientes();
  }

  carregarDadosDoUsuario(usuarioId: number): void {
    this.projectsService.getProjetosPorUsuario(usuarioId).subscribe(
      (projetos) => {
        this.meusProjetos = projetos;
        this.projetosFiltrados = [...projetos];
        this.atualizarResumoProjetos();

        this.carregarTarefasDoUsuario(usuarioId);

        this.carregarTarefasDosProjetos(usuarioId);
      },
      (error) => {
        console.error('Erro ao carregar projetos do usuário:', error);
      }
    );
  }

  carregarTarefasDoUsuario(usuarioId: number): void {
    console.log('Buscando tarefas para o usuário ID:', usuarioId);
    this.tarefaService.getTarefasPorUsuario(usuarioId).subscribe(
      (tarefas) => {
        console.log('Tarefas recebidas:', tarefas);
        this.minhasTarefas = tarefas;
        this.tarefasFiltradas = [...tarefas];
        this.atualizarResumoTarefas();
      },
      (error) => {
        console.error('Erro ao carregar tarefas do usuário:', error);
      }
    );
  }

  carregarTarefasDosProjetos(usuarioId: number): void {
    console.log('Buscando tarefas dos projetos do usuário ID:', usuarioId);
    this.tarefaService.getTarefasPorProjetoDoUsuario(usuarioId).subscribe(
      (tarefas) => {
        console.log('Tarefas dos projetos recebidas:', tarefas);
        this.tarefasDosProjetos = tarefas;

        const todasTarefasMap = new Map();

        this.minhasTarefas.forEach(tarefa => {
          todasTarefasMap.set(tarefa.id, tarefa);
        });

        tarefas.forEach(tarefa => {
          todasTarefasMap.set(tarefa.id, tarefa);
        });

        this.minhasTarefas = Array.from(todasTarefasMap.values());
        this.tarefasFiltradas = [...this.minhasTarefas];

        this.atualizarResumoTarefas();
      },
      (error) => {
        console.error('Erro ao carregar tarefas dos projetos do usuário:', error);
      }
    );
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
    });
  }

  aplicarFiltros(): void {
    if (!this.meusProjetos || this.meusProjetos.length === 0) return;

    this.projetosFiltrados = this.meusProjetos.filter((projeto) => {
      const dataInicioProjeto = new Date(projeto.dataInicio);
      const dataFimProjeto = new Date(projeto.dataFim);
      const dataInicioFiltro = this.selectedDataInicio ? new Date(this.selectedDataInicio) : null;
      const dataFimFiltro = this.selectedDataFim ? new Date(this.selectedDataFim) : null;

      return (
        (!this.selectedCliente || projeto.cliente.id === Number(this.selectedCliente)) &&
        (!this.selectedStatus || projeto.status === this.selectedStatus) &&
        (!this.selectedPrioridade || projeto.prioridade === this.selectedPrioridade) &&
        (!dataInicioFiltro || dataInicioProjeto >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimProjeto <= dataFimFiltro)
      );
    });

    this.atualizarResumoProjetos();
  }

  aplicarFiltrosTarefas(): void {
    if (!this.minhasTarefas || this.minhasTarefas.length === 0) return;

    this.tarefasFiltradas = this.minhasTarefas.filter((tarefa) => {
      const dataInicioTarefa = new Date(tarefa.dataInicio);
      const dataFimTarefa = new Date(tarefa.dataFim);
      const dataInicioFiltro = this.selectedDataInicioTarefa ? new Date(this.selectedDataInicioTarefa) : null;
      const dataFimFiltro = this.selectedDataFimTarefa ? new Date(this.selectedDataFimTarefa) : null;

      const clienteId = tarefa.projeto ? this.getClienteByProjetoId(tarefa.projeto.id) : null;

      return (
        (!this.selectedProjetoTarefa || (tarefa.projeto && tarefa.projeto.id === Number(this.selectedProjetoTarefa))) &&
        (!this.selectedClienteTarefa || (clienteId && clienteId === Number(this.selectedClienteTarefa))) &&
        (!this.selectedStatusTarefa || tarefa.status === this.selectedStatusTarefa) &&
        (!this.selectedPrioridadeTarefa || this.getTarefaPrioridade(tarefa) === this.selectedPrioridadeTarefa) &&
        (!dataInicioFiltro || dataInicioTarefa >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimTarefa <= dataFimFiltro)
      );
    });

    this.atualizarResumoTarefas();
  }

  getClienteByProjetoId(projetoId: number): number | null {
    const projeto = this.meusProjetos.find(p => p.id === projetoId);
    return projeto && projeto.cliente ? projeto.cliente.id : null;
  }

  getTarefaPrioridade(tarefa: Tarefa): string {
    if ('prioridade' in tarefa) {
      return (tarefa as any).prioridade;
    } else {
      const projeto = this.meusProjetos.find(p => p.id === tarefa.projeto.id);
      return projeto ? projeto.prioridade : '';
    }
  }

  atualizarResumoProjetos(): void {
    this.totalProjetos = this.projetosFiltrados.length;
    this.horasEstimadas = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.horasEstimadas ?? 0), 0);
    this.tempoRegistrado = this.projetosFiltrados.reduce((total, projeto) => total + (projeto.tempoRegistrado ?? 0), 0);
    this.projetosEmAndamento = this.projetosFiltrados.filter(projeto => projeto.status === 'EM_ANDAMENTO').length;
    this.projetosConcluidos = this.projetosFiltrados.filter(projeto => projeto.status === 'CONCLUIDO').length;
  }

  atualizarResumoTarefas(): void {
    this.totalTarefas = this.tarefasFiltradas.length;
    this.tarefasConcluidas = this.tarefasFiltradas.filter(tarefa => tarefa.status === 'CONCLUIDA').length;
    this.tarefasEmAndamento = this.tarefasFiltradas.filter(tarefa => tarefa.status === 'EM_ANDAMENTO').length;
    this.horasEstimadasTarefas = this.tarefasFiltradas.reduce((total, tarefa) => total + (tarefa.horasEstimadas ?? 0), 0);
    this.horasRegistradasTarefas = this.tarefasFiltradas.reduce((total, tarefa) => total + (tarefa.tempoRegistrado ?? 0), 0);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  limparFiltros(): void {
    if (this.activeTab === 'projetos') {
      this.selectedCliente = '';
      this.selectedStatus = '';
      this.selectedPrioridade = '';
      this.selectedDataInicio = '';
      this.selectedDataFim = '';
      this.projetosFiltrados = [...this.meusProjetos];
      this.atualizarResumoProjetos();
    } else {
      this.selectedProjetoTarefa = '';
      this.selectedClienteTarefa = '';
      this.selectedStatusTarefa = '';
      this.selectedPrioridadeTarefa = '';
      this.selectedDataInicioTarefa = '';
      this.selectedDataFimTarefa = '';
      this.tarefasFiltradas = [...this.minhasTarefas];
      this.atualizarResumoTarefas();
    }
  }

  exportarPDF(): void {
    const elemento = document.querySelector(this.activeTab === 'projetos' ? '.projects-table' : '.tasks-table');
    const titulo = this.activeTab === 'projetos' ? 'Relatório dos Meus Projetos' : 'Relatório das Minhas Tarefas';

    if (!elemento) return;

    html2canvas(elemento as HTMLElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.setFontSize(16);
      pdf.text(titulo, 105, 15, { align: 'center' });

      const hoje = new Date().toLocaleDateString('pt-BR');
      pdf.setFontSize(10);
      pdf.text(`Exportado em: ${hoje}`, 105, 22, { align: 'center' });

      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 30);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`meu_relatorio_${this.activeTab}_${hoje.replace(/\//g, '-')}.pdf`);
    });
  }
}
