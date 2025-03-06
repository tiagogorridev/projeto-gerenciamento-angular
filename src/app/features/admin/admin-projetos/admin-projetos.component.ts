import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { Router } from '@angular/router';
import { Cliente } from '../../../core/auth/services/clients.service';
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
            custoTrabalhado: projeto.custoRegistrado || 0,
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
        this.clientes = clientes;
      },
      error: (erro) => {
        console.error('Erro ao carregar os clientes:', erro);
      }
    });
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
  }

  navegarParaEdicao(projetoId: string, projetoNome: string): void {
    this.router.navigate(['/admin/edit-projects', projetoId], {
      state: { projectName: projetoNome }
    });
  }

  onSubmit(projectForm: any): void {
    if (projectForm.valid) {
      this.project.dataInicio = this.startDate;
      this.project.dataFim = this.endDate;

      const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);

      const clienteId = this.project.cliente;
      const clienteCompleto = this.clientes.find(c => c.id.toString() === clienteId.toString());

      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: { id: usuarioId },
        cliente: { id: clienteId }
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          this.projectsService.addMemberToProject(usuarioId, resposta.id).subscribe({
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
