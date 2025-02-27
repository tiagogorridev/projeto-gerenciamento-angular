import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../../../core/auth/services/time-tracking.service.ts.service';
import { Router } from '@angular/router';

interface LancamentoHoras {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  horas: number;
  descricao: string;
  status: 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';
  projeto: {
    id: number;
    nome: string;
  };
  tarefa: {
    id: number;
    nome: string;
  };
  usuario: {
    id: number;
    nome: string;
  };
}

interface StatusFilter {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-time-history',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.scss']
})
export class TimeHistoryComponent implements OnInit {
  lancamentos: LancamentoHoras[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  usuarioId: number | null = null;

  filteredLancamentos: LancamentoHoras[] = [];
  searchQuery: string = '';
  selectedStatus: string = 'todos';

  statusFilters: StatusFilter[] = [
    { label: 'Todos', value: 'todos', icon: 'pi pi-list' },
    { label: 'Aprovados', value: 'aprovado', icon: 'pi pi-check-circle' },
    { label: 'Reprovados', value: 'reprovado', icon: 'pi pi-times-circle' },
    { label: 'Em análise', value: 'em_analise', icon: 'pi pi-search' }
  ];
  constructor(
    private timeTrackingService: TimeTrackingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.getUsuarioIdFromLocalStorage();
    if (this.usuarioId !== null) {
      this.loadLancamentos();
    } else {
      this.errorMessage = 'Usuário não encontrado. Por favor, faça login novamente.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }
  }

  getUsuarioIdFromLocalStorage(): number | null {
    const usuarioId = localStorage.getItem('usuario_id');
    return usuarioId ? parseInt(usuarioId, 10) : null;
  }

  loadLancamentos(): void {
    if (this.usuarioId === null) return;

    this.isLoading = true;
    this.timeTrackingService.getLancamentosByUsuario(this.usuarioId).subscribe({
      next: (lancamentos) => {
        this.lancamentos = lancamentos;
        this.isLoading = false;
        this.errorMessage = '';
        this.filteredLancamentos = [...this.lancamentos];
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
        if (error.includes('Sessão expirada')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatStatus(status: string): string {
    switch(status) {
      case 'EM_ANALISE':
        return 'Em Análise';
      case 'APROVADO':
        return 'Aprovado';
      case 'REPROVADO':
        return 'Reprovado';
      default:
        return status;
    }
  }

  formatDuration(horas: number): string {
    const horasInteiras = Math.floor(horas);
    const minutos = (horas - horasInteiras) * 60;
    const minutosInteiros = Math.round(minutos);
    const minutosFinal = minutosInteiros > 59 ? 59 : minutosInteiros;

    return `${horasInteiras}h ${minutosFinal < 10 ? '0' + minutosFinal : minutosFinal}min`;
  }

  getStatusClass(status: string): string {
    const statusLowerCase = status.toLowerCase();

    if (statusLowerCase.includes('analise') || statusLowerCase.includes('análise')) {
      return 'status-em-analise';
    } else if (statusLowerCase.includes('aprovado')) {
      return 'status-aprovado';
    } else if (statusLowerCase.includes('reprovado')) {
      return 'status-reprovado';
    } else {
      return '';
    }
  }

  filterLancamentos(): void {
    let filtered = this.lancamentos;

    // Filter by search query
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(lancamento =>
        lancamento.projeto.nome.toLowerCase().includes(query) ||
        lancamento.tarefa.nome.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (this.selectedStatus !== 'todos') {
      filtered = filtered.filter(lancamento =>
        lancamento.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    this.filteredLancamentos = filtered;
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.filterLancamentos();
  }
}
