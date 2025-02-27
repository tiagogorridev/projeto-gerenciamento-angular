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
}
