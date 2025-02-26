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
    this.loadingProjetos = true;
    const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);

    if (usuarioId) {
      this.projectsService.getProjetosDoUsuario(usuarioId).pipe(
        switchMap(projetos => {
          this.projects = projetos;

          // Para cada projeto, buscar o tempo registrado
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
          // Atualizar os projetos com os dados de tempo registrado
          this.projects = this.projects.map((projeto, index) => ({
            ...projeto,
            tempoRegistrado: tempoRegistradoResults[index].tempoRegistrado,
            percentualConcluido: tempoRegistradoResults[index].percentualConcluido,
            horasTrabalhadas: projeto.horasTrabalhadas || 0,
            custoTrabalhado: projeto.custoTrabalhado || 0
          }));

          this.filteredProjects = [...this.projects];
          this.hasProjects = this.projects.length > 0;
          this.loadingProjetos = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar os projetos:', erro);
          this.loadingProjetos = false;
        }
      });
    }

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
      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: { id: usuarioId }
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          this.closeModal();
          this.projects.push({
            ...resposta,
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
}
