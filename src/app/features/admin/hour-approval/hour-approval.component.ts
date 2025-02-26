import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../../../core/auth/services/time-tracking.service.ts.service';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { finalize } from 'rxjs/operators';

interface LancamentoHoras {
  id: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  projeto: {
    id: number;
    nome: string;
  };
  tarefa: {
    id: number;
    nome: string;
  };
  horas: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  descricao: string;
  status: string;
}

@Component({
  selector: 'app-hour-approval',
  templateUrl: './hour-approval.component.html',
  styleUrls: ['./hour-approval.component.scss']
})
export class HourApprovalComponent implements OnInit {
  lancamentos: LancamentoHoras[] = [];
  projetos: any[] = [];
  startDate: Date | null = null;
  selectedProject: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private timeTrackingService: TimeTrackingService,
    private projectService: ProjectsService
  ) {}

  ngOnInit() {
    this.carregarProjetos();
    this.carregarLancamentos();
  }

  carregarProjetos() {
    this.loading = true;
    const adminId = localStorage.getItem('userId');

    if (adminId) {
      const adminIdNumber = Number(adminId);
      if (!isNaN(adminIdNumber)) {
        this.projectService.getProjetosAssociados(adminIdNumber)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (projetos) => {
              this.projetos = projetos;
            },
            error: (error) => {
              this.errorMessage = 'Erro ao carregar projetos: ' + error;
              console.error('Erro ao carregar projetos:', error);
            }
          });
      } else {
        this.errorMessage = 'ID do usuário é inválido.';
        console.error('ID do usuário é inválido.');
        this.loading = false;
      }
    } else {
      this.errorMessage = 'ID do usuário não encontrado no localStorage';
      console.error('ID do usuário não encontrado no localStorage');
      this.loading = false;
    }
  }

  carregarLancamentos() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.timeTrackingService.getLancamentosEmAnalise()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (lancamentos) => {
          this.lancamentos = lancamentos;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar lançamentos: ' + error;
          console.error('Erro ao carregar lançamentos:', error);
        }
      });
  }

  aprovarLancamento(lancamentoId: number) {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.timeTrackingService.aprovarLancamento(lancamentoId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.successMessage = 'Lançamento aprovado com sucesso!';
          const lancamento = this.lancamentos.find(l => l.id === lancamentoId);
          if (lancamento) {
            lancamento.status = 'APROVADO';
          }
          this.carregarLancamentos();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao aprovar lançamento: ' + error;
          console.error('Erro ao aprovar lançamento:', error);
        }
      });
  }

  rejeitarLancamento(lancamentoId: number) {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.timeTrackingService.rejeitarLancamento(lancamentoId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.successMessage = 'Lançamento rejeitado com sucesso!';
          const lancamento = this.lancamentos.find(l => l.id === lancamentoId);
          if (lancamento) {
            lancamento.status = 'REJEITADO';
          }
          this.carregarLancamentos();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao rejeitar lançamento: ' + error;
          console.error('Erro ao rejeitar lançamento:', error);
        }
      });
  }

  formatarHoras(horas: number): string {
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);

    if (minutos > 0) {
      return `${horasInteiras}h ${minutos}m`;
    }
    return `${horasInteiras}h`;
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'EM_ANALISE': 'pendente',
      'APROVADO': 'aprovado',
      'REJEITADO': 'reprovado'
    };
    return statusMap[status] || '';
  }

  filtrarLancamentos() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.timeTrackingService.getLancamentosEmAnalise()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (lancamentos) => {
          this.lancamentos = lancamentos.filter(lancamento => {
            let passaFiltro = true;

            if (this.selectedProject) {
              passaFiltro = passaFiltro && lancamento.projeto.id === this.selectedProject;
            }

            if (this.startDate) {
              const dataLancamento = new Date(lancamento.data);
              const dataInicio = new Date(this.startDate);
              passaFiltro = passaFiltro &&
                dataLancamento.getFullYear() === dataInicio.getFullYear() &&
                dataLancamento.getMonth() === dataInicio.getMonth() &&
                dataLancamento.getDate() === dataInicio.getDate();
            }

            return passaFiltro;
          });

          if (this.lancamentos.length === 0) {
            this.successMessage = 'Nenhum lançamento encontrado com os filtros aplicados.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao filtrar lançamentos: ' + error;
          console.error('Erro ao filtrar lançamentos:', error);
        }
      });
  }

  limparFiltros() {
    this.startDate = null;
    this.selectedProject = null;
    this.carregarLancamentos();
  }
}
