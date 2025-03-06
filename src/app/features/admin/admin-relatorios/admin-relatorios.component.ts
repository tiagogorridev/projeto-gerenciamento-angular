import { Usuario } from './../../../core/auth/services/usuario.model';
import { UsuarioService } from './../../../core/auth/services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { TarefaService } from 'src/app/core/auth/services/tarefa.service';

import { Projeto } from '../../../core/auth/services/projeto.model';
import { Tarefa } from '../../../core/auth/services/tarefa.model';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  administradores: any[] = [];
  usuariosAssociados: Usuario[] = [];

  tarefas: Tarefa[] = [];
  tarefasFiltradas: Tarefa[] = [];

  selectedCliente: string = '';
  selectedUsuario: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';
  selectedDataInicio: string = '';
  selectedDataFim: string = '';

  selectedProjetoTarefa: string = '';
  selectedClienteTarefa: string = '';
  selectedUsuarioTarefa: string = '';
  selectedAdminTarefa: string = '';
  selectedStatusTarefa: string = '';
  selectedPrioridadeTarefa: string = '';
  selectedDataInicioTarefa: string = '';
  selectedDataFimTarefa: string = '';

  totalProjetos: number = 0;
  horasEstimadas: number = 0;
  tempoRegistrado: number = 0;
  custoEstimado: number = 0;
  custoTrabalhado: number = 0;

  totalTarefas: number = 0;
  tarefasConcluidas: number = 0;
  tarefasEmAndamento: number = 0;
  horasEstimadasTarefas: number = 0;
  horasRegistradasTarefas: number = 0;

  selectedAdmin: string = '';

  activeTab: string = 'projetos';

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
    this.carregarUsuariosAssociados();
    this.carregarTarefas();
  }


  carregarProjetos(): void {
    this.projectsService.getProjetos().subscribe((projetos) => {
      this.projetos = projetos;

      this.projetos.forEach((projeto) => {
        const usuarioEmail = this.usuarioService.getEmailByUsuarioId(projeto.usuarioResponsavel.id);
        console.log(usuarioEmail);
      });

      this.aplicarFiltros();
    });
  }

  carregarTarefas(): void {
    this.tarefaService.getTodasTarefas().subscribe(
      (tarefas) => {
        this.tarefas = tarefas;
        this.tarefasFiltradas = tarefas;
        this.atualizarResumoTarefas();
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
      this.administradores = usuarios.filter(usuario => usuario.perfil === 'ADMIN');
    });
  }

  carregarUsuariosAssociados(): void {
    if (this.projetos.length === 0) {
      this.projectsService.getProjetos().subscribe(projetos => {
        this.projetos = projetos;
        this.buscarMembrosDosProjetos(projetos);
      });
    } else {
      this.buscarMembrosDosProjetos(this.projetos);
    }
  }


buscarMembrosDosProjetos(projetos: Projeto[]): void {
  const usuariosMap = new Map();

  let projetosProcessados = 0;

  projetos.forEach(projeto => {
    this.projectsService.getMembrosDoProjeto(projeto.id).subscribe(
      (membros) => {
          membros.forEach(membro => {
              if (!membro.email) {
                  this.usuarioService.getUsuarioById(membro.id).subscribe(
                      usuario => {
                          membro.email = usuario.email;
                          usuariosMap.set(membro.id, membro);
                      }
                  );
              } else {
                  usuariosMap.set(membro.id, membro);
              }
          });

        projetosProcessados++;

        if (projetosProcessados === projetos.length) {
          this.atualizarListaUsuarios(usuariosMap);
        }
      },
      (error) => {
        console.error(`Erro ao carregar membros do projeto ${projeto.id}:`, error);
        projetosProcessados++;

        if (projetosProcessados === projetos.length) {
          this.atualizarListaUsuarios(usuariosMap);
        }
      }
    );
  });
}

atualizarListaUsuarios(usuariosMap: Map<number, any>): void {
  this.usuariosAssociados = Array.from(usuariosMap.values());
  this.usuarios = this.usuariosAssociados;
  console.log('Usuários associados a projetos com emails:', this.usuariosAssociados);
}
  obterUsuariosDosProjetos(): void {
    if (this.projetos.length === 0) {
      this.projectsService.getProjetos().subscribe((projetos) => {
        this.extrairUsuariosDosProjetos(projetos);
      });
    } else {
      this.extrairUsuariosDosProjetos(this.projetos);
    }
  }

  extrairUsuariosDosProjetos(projetos: Projeto[]): void {
    const usuariosMap = new Map();

    projetos.forEach(projeto => {
      if (projeto.usuarioResponsavel && projeto.usuarioResponsavel.id) {
        usuariosMap.set(projeto.usuarioResponsavel.id, projeto.usuarioResponsavel);
      }

      if (projeto.membrosAssociados && Array.isArray(projeto.membrosAssociados)) {
        projeto.membrosAssociados.forEach(membro => {
          if (membro && membro.id) {
            usuariosMap.set(membro.id, membro);
          }
        });
      }
    });

    this.usuariosAssociados = Array.from(usuariosMap.values());
    this.usuarios = this.usuariosAssociados;
    console.log('Usuários extraídos dos projetos:', this.usuariosAssociados);
  }

  aplicarFiltros(): void {
    this.projetosFiltrados = this.projetos.filter((projeto) => {
      const dataInicioProjeto = new Date(projeto.dataInicio);
      const dataFimProjeto = new Date(projeto.dataFim);
      const dataInicioFiltro = this.selectedDataInicio ? new Date(this.selectedDataInicio) : null;
      const dataFimFiltro = this.selectedDataFim ? new Date(this.selectedDataFim) : null;

      const isAdmin = this.selectedAdmin ?
                     this.administradores.some(admin =>
                       admin.id === projeto.usuarioResponsavel.id &&
                       admin.id === Number(this.selectedAdmin)) :
                     true;

                     let isUser = true;
                     if (this.selectedUsuario) {
                         const userId = Number(this.selectedUsuario);
                         isUser = projeto.usuarioResponsavel.id === userId;
                         if (!isUser && projeto.membrosAssociados && Array.isArray(projeto.membrosAssociados)) {
                             isUser = projeto.membrosAssociados.some(membro => membro.id === userId);
                         }
                     }

      return (
        (!this.selectedCliente || projeto.cliente.id === Number(this.selectedCliente)) &&
        (!this.selectedStatus || projeto.status === this.selectedStatus) &&
        (!this.selectedPrioridade || projeto.prioridade === this.selectedPrioridade) &&
        (!dataInicioFiltro || dataInicioProjeto >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimProjeto <= dataFimFiltro) &&
        isAdmin &&
        isUser
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

      const isAdmin = this.selectedAdminTarefa ?
                    this.administradores.some(admin =>
                      admin.id === tarefa.usuarioResponsavel.id &&
                      admin.id === Number(this.selectedAdminTarefa)) :
                    true;

      let isUser = true;
      if (this.selectedUsuarioTarefa) {
        const userId = Number(this.selectedUsuarioTarefa);

        isUser = tarefa.usuarioResponsavel.id === userId;

        if (!isUser && tarefa.usuariosAssociados && Array.isArray(tarefa.usuariosAssociados)) {
          isUser = tarefa.usuariosAssociados.some(usuario => usuario.id === userId);
        }
      }

      return (
        (!this.selectedProjetoTarefa || tarefa.projeto.id === Number(this.selectedProjetoTarefa)) &&
        (!this.selectedClienteTarefa || (tarefa.projeto && this.getClienteByProjetoId(tarefa.projeto.id) === Number(this.selectedClienteTarefa))) &&
        (!this.selectedAdminTarefa || isAdmin) &&
        (!this.selectedStatusTarefa || tarefa.status === this.selectedStatusTarefa) &&
        (!this.selectedPrioridadeTarefa || this.getTarefaPrioridade(tarefa) === this.selectedPrioridadeTarefa) &&
        (!dataInicioFiltro || dataInicioTarefa >= dataInicioFiltro) &&
        (!dataFimFiltro || dataFimTarefa <= dataFimFiltro) &&
        isUser
      );
    });

    this.atualizarResumoTarefas();
  }

  getClienteByProjetoId(projetoId: number): number | null {
    const projeto = this.projetos.find(p => p.id === projetoId);
    return projeto ? projeto.cliente.id : null;
  }

  getTarefaPrioridade(tarefa: Tarefa): string {
    if ('prioridade' in tarefa) {
      return (tarefa as any).prioridade;
    } else {
      const projeto = this.projetos.find(p => p.id === tarefa.projeto.id);
      return projeto ? projeto.prioridade : '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANEJADO':
      case 'ABERTA': return 'status-planejado';
      case 'EM_ANDAMENTO': return 'status-em-andamento';
      case 'CONCLUIDO':
      case 'CONCLUIDA': return 'status-concluido';
      case 'CANCELADO':
      case 'PAUSADA': return 'status-cancelado';
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
    this.totalTarefas = this.tarefasFiltradas.length;
    this.tarefasConcluidas = this.tarefasFiltradas.filter(tarefa =>
      tarefa.status === 'CONCLUIDA').length;
    this.tarefasEmAndamento = this.tarefasFiltradas.filter(tarefa =>
      tarefa.status === 'EM_ANDAMENTO').length;
    this.horasEstimadasTarefas = this.tarefasFiltradas.reduce((total, tarefa) =>
      total + (tarefa.horasEstimadas ?? 0), 0);
    this.horasRegistradasTarefas = this.tarefasFiltradas.reduce((total, tarefa) =>
      total + (tarefa.tempoRegistrado ?? 0), 0);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  limparFiltros(): void {
    if (this.activeTab === 'projetos') {
      this.selectedCliente = '';
      this.selectedAdmin = '';
      this.selectedUsuario = '';
      this.selectedStatus = '';
      this.selectedPrioridade = '';
      this.selectedDataInicio = '';
      this.selectedDataFim = '';
      this.aplicarFiltros();
    } else {
      this.selectedProjetoTarefa = '';
      this.selectedClienteTarefa = '';
      this.selectedAdminTarefa = '';
      this.selectedUsuarioTarefa = '';
      this.selectedStatusTarefa = '';
      this.selectedPrioridadeTarefa = '';
      this.selectedDataInicioTarefa = '';
      this.selectedDataFimTarefa = '';
      this.tarefasFiltradas = this.tarefas;
      this.atualizarResumoTarefas();
    }
  }

  exportarPDF() {
    const elemento = document.querySelector(this.activeTab === 'projetos' ? '.projects-table' : '.tasks-table');
    const titulo = this.activeTab === 'projetos' ? 'Relatório de Projetos' : 'Relatório de Tarefas';

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

      pdf.save(`relatorio_${this.activeTab}_${hoje.replace(/\//g, '-')}.pdf`);
    });
  }
}
