import { AssociarUsuarioService } from './../../../core/auth/services/associar-usuario.service';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { Router } from '@angular/router';
import { Cliente } from '../../../core/auth/model/clients.model';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-projetos',
  templateUrl: './admin-projetos.component.html',
  styleUrls: ['./admin-projetos.component.scss']
})
export class AdminProjetosComponent implements OnInit {
  hasProjects: boolean = false;
  showNewProjectModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  projetoParaExcluir: any = null;

  projects: any[] = [];
  clientes: Cliente[] = [];

  filteredProjects: any[] = [];
  selectedStatus: string = '';
  selectedPriority: string = '';
  loadingProjetos: boolean = true;
  formSubmitted: boolean = false;
  searchQuery: string = '';

  project = {
    nome: '',
    descricao: '',
    cliente: '',
    horasEstimadas: 0,
    custoEstimado: 0,
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
    status: 'PLANEJADO',
    prioridade: 'ALTA'
  };

  startDate: Date | null = new Date();
  endDate: Date | null = new Date();

  constructor(
    private projectsService: ProjectsService,
    private clienteService: ClienteService,
    private associarUsuarioService: AssociarUsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProjetos();
    this.carregarClientes();
  }

  carregarProjetos(): void {
    this.loadingProjetos = true;
    const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);

    if (usuarioId) {
      this.projectsService.getProjetosDoUsuario(usuarioId).pipe(
        switchMap(projetos => {
          this.projects = projetos;

          const tempoRegistradoRequests = projetos.map(projeto =>
            this.projectsService.getTempoRegistradoProjeto(projeto.id).pipe(
              catchError(error => {
                console.error(`Erro ao buscar tempo registrado para projeto ${projeto.id}`, error);
                return of({ tempoRegistrado: 0, percentualConcluido: 0 });
              })
            )
          );

          return forkJoin(tempoRegistradoRequests);
        })
      ).subscribe({
        next: (tempoRegistradoResults) => {
          this.projects = this.projects.map((projeto, index) => ({
            ...projeto,
            tempoRegistrado: tempoRegistradoResults[index].tempoRegistrado,
            percentualConcluido: tempoRegistradoResults[index].percentualConcluido,
            horasTrabalhadas: projeto.horasTrabalhadas || 0,
            custoRegistrado: projeto.custoRegistrado || 0,
            custoEstimado: projeto.custoEstimado || 0,
          }));

          this.filteredProjects = [...this.projects];
          this.hasProjects = this.projects.length > 0;
          this.loadingProjetos = false;
          console.log('Projetos carregados:', this.projects);

        },
        error: (erro) => {
          console.error('Erro ao carregar os projetos:', erro);
          this.loadingProjetos = false;
        }
      });
    }
  }

  carregarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes.filter(cliente => cliente.status === 'ATIVO');
      },
      error: (erro) => {
        console.error('Erro ao carregar os clientes:', erro);
      }
    });
  }

  formatTime(totalHoras: number): string {
    const horas = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horas) * 60);

    if (minutos > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${horas}h`;
    }
  }

  formatarMoeda(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  filterProjects(): void {
    let filtered = this.projects;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter(projeto =>
        projeto.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedStatus && this.selectedStatus !== 'TODOS') {
      filtered = filtered.filter(projeto => projeto.status === this.selectedStatus);
    }

    if (this.selectedPriority && this.selectedPriority !== 'TODOS') {
      filtered = filtered.filter(projeto => projeto.prioridade === this.selectedPriority);
    }

    this.filteredProjects = filtered;
  }

  getProgressBarClass(percentualConcluido: number): string {
    if (percentualConcluido >= 100) {
      return 'bg-success';
    } else if (percentualConcluido >= 75) {
      return 'bg-info';
    } else if (percentualConcluido >= 50) {
      return 'bg-warning';
    } else {
      return 'bg-danger';
    }
  }

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  closeModal(): void {
    this.showNewProjectModal = false;

    this.project = {
      nome: '',
      descricao: '',
      cliente: '',
      horasEstimadas: 0,
      custoEstimado: 0,
      dataInicio: null,
      dataFim: null,
      status: 'PLANEJADO',
      prioridade: 'ALTA'
    };

    this.startDate = new Date();
    this.endDate = new Date();

    this.formSubmitted = false;
  }

  navegarParaEdicao(projetoId: string, projetoNome: string): void {
    this.router.navigate(['/admin/edit-projects', projetoId], {
      state: { projectName: projetoNome }
    });
  }

  onSubmit(projectForm: any): void {
    this.formSubmitted = true;
    if (projectForm.valid) {
      if (this.startDate) {
        const dataInicio = new Date(this.startDate);
        dataInicio.setHours(12, 0, 0, 0);
        this.project.dataInicio = dataInicio;
      }

      if (this.endDate) {
        const dataFim = new Date(this.endDate);
        dataFim.setHours(12, 0, 0, 0);
        this.project.dataFim = dataFim;
      }

      const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);

      const clienteId = this.project.cliente;
      const clienteCompleto = this.clientes.find(c => c.id !== undefined && c.id.toString() === clienteId.toString());
      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: { id: usuarioId },
        cliente: { id: clienteId }
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          this.associarUsuarioService.addMemberToProject(usuarioId, resposta.id).subscribe({
            next: () => {
              console.log('Admin adicionado como membro do projeto automaticamente');
            },
            error: (erro) => {
              console.error('Erro ao adicionar admin como membro do projeto:', erro);
            }
          });

          this.closeModal();

          this.projects.push({
            ...resposta,
            cliente: clienteCompleto,
            tempoRegistrado: 0,
            percentualConcluido: 0
          });

          this.filterProjects();
          this.hasProjects = this.projects.length > 0;
        },
        error: (erro) => {
          console.error('Erro ao criar projeto:', erro);
        }
      });
    }
  }

  confirmarExclusao(projeto: any): void {
    event?.stopPropagation();

    this.projetoParaExcluir = projeto;
    this.showDeleteConfirmModal = true;
  }

  cancelarExclusao(): void {
    this.projetoParaExcluir = null;
    this.showDeleteConfirmModal = false;
  }

  excluirProjeto(): void {
    if (this.projetoParaExcluir && this.projetoParaExcluir.id) {
      this.projectsService.deleteProjeto(this.projetoParaExcluir.id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== this.projetoParaExcluir.id);
          this.filterProjects();
          this.hasProjects = this.projects.length > 0;

          this.cancelarExclusao();
        },
        error: (erro) => {
          console.error('Erro ao excluir projeto:', erro);
        }
      });
    }
  }
}
