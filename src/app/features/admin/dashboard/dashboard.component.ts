import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../../../core/auth/services/time-tracking.service.ts.service';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { forkJoin } from 'rxjs';
import { Usuario } from '../../../core/auth/services/usuario.model';
import { Projeto } from '../../../core/auth/services/projeto.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalHorasMes: number = 0;
  horasAprovadas: number = 0;
  horasReprovadas: number = 0;
  horasEmAnalise: number = 0;
  mediaHorasUsuario: number = 0;
  usuariosAtivos: number = 0;
  topUsuarios: any[] = [];
  topProjetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];
  statusFiltro: string = 'all';
  prioridadeFiltro: string = 'all';
  dataAtualizacao: string = new Date().toLocaleDateString('pt-BR');

    horasStatusChart: any;
    horasTendenciaChart: any;

  constructor(
    private timeTrackingService: TimeTrackingService,
    private usuarioService: UsuarioService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }


  carregarDados(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      const usuariosAtivos = usuarios.filter(u => u.ativo === 'ATIVO');
      this.usuariosAtivos = usuariosAtivos.length;

      this.timeTrackingService.getLancamentosEmAnalise().subscribe(lancamentosEmAnalise => {
        this.horasEmAnalise = this.calcularTotalHoras(lancamentosEmAnalise);
        this.carregarTodosLancamentos(usuariosAtivos);
      });
    });
    this.criarGraficos();
  }

  carregarTodosLancamentos(usuarios: Usuario[]): void {
    const lancamentosRequests = usuarios.map(usuario =>
      this.timeTrackingService.getLancamentosByUsuario(usuario.id || 0)
    );

    forkJoin(lancamentosRequests).subscribe(todosLancamentos => {
      const lancamentos = todosLancamentos.flat();
      this.totalHorasMes = this.calcularTotalHoras(lancamentos);
      this.horasAprovadas = this.calcularTotalHorasPorStatus(lancamentos, 'APROVADO');
      this.horasReprovadas = this.calcularTotalHorasPorStatus(lancamentos, 'REPROVADO');
      this.mediaHorasUsuario = this.usuariosAtivos > 0 ?
        this.totalHorasMes / this.usuariosAtivos : 0;
      this.calcularTopUsuarios(todosLancamentos, usuarios);
    });
  }

  calcularTotalHoras(lancamentos: any[]): number {
    return lancamentos.reduce((total, lancamento) => {
      const horaInicio = this.converterParaMinutos(lancamento.horaInicio);
      const horaFim = this.converterParaMinutos(lancamento.horaFim);
      const diferencaMinutos = horaFim - horaInicio;
      return total + (diferencaMinutos / 60);
    }, 0);
  }

  calcularTotalHorasPorStatus(lancamentos: any[], status: string): number {
    const lancamentosFiltrados = lancamentos.filter(l => l.status === status);
    return this.calcularTotalHoras(lancamentosFiltrados);
  }

  converterParaMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  calcularTopUsuarios(todosLancamentos: any[][], usuarios: Usuario[]): void {
    const horasPorUsuario = todosLancamentos.map((lancamentos, index) => {
      const totalHoras = this.calcularTotalHoras(lancamentos);
      return {
        usuario: usuarios[index],
        horas: totalHoras
      };
    });

    this.topUsuarios = horasPorUsuario
      .sort((a, b) => b.horas - a.horas)
      .slice(0, 5)
      .map(item => ({
        id: item.usuario.id,
        nome: item.usuario.nome,
        cargo: this.getCargo(item.usuario.perfil),
        horas: item.horas
      }));
  }

  getCargo(perfil: string): string {
    switch(perfil) {
      case 'ADMIN':
        return 'Administrador';
      case 'USUARIO':
        return 'Usuário';
      default:
        return 'Colaborador';
    }
  }

  calcularPorcentagem(parte: number, total: number): number {
    return total > 0 ? (parte / total) * 100 : 0;
  }

  getPriorityClass(prioridade: string): string {
    switch(prioridade) {
      case 'ALTA':
        return 'high-priority';
      case 'MEDIA':
        return 'medium-priority';
      case 'BAIXA':
        return 'low-priority';
      default:
        return '';
    }
  }

  getPriorityDisplay(prioridade: string): string {
    switch(prioridade) {
      case 'ALTA':
        return 'Alta Prioridade';
      case 'MEDIA':
        return 'Média Prioridade';
      case 'BAIXA':
        return 'Baixa Prioridade';
      default:
        return 'Não Definida';
    }
  }

  calcularProgresso(projeto: Projeto): number {
    if (!projeto.horasEstimadas || projeto.horasEstimadas === 0) {
      return 0;
    }

    const tempoRegistrado = projeto.tempoRegistrado || 0;
    const progresso = (tempoRegistrado / projeto.horasEstimadas) * 100;

    return Math.min(Math.round(progresso * 100) / 100, 100);
  }

  filtrarProjetos(): void {
    this.projetosFiltrados = this.topProjetos.filter(projeto => {
      const matchStatus = this.statusFiltro === 'all' || projeto.status === this.statusFiltro;
      const matchPrioridade = this.prioridadeFiltro === 'all' || projeto.prioridade === this.prioridadeFiltro;
      return matchStatus && matchPrioridade;
    });
  }

  criarGraficos(): void {
    this.criarGraficoStatus();
    this.criarGraficoTendencia();
  }

  criarGraficoStatus(): void {
    const ctx = document.getElementById('horasStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.horasStatusChart) {
      this.horasStatusChart.destroy();
    }

    this.horasStatusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Aprovadas', 'Reprovadas', 'Em Análise'],
        datasets: [{
          data: [this.horasAprovadas, this.horasReprovadas, this.horasEmAnalise],
          backgroundColor: [
            '#10b981',
            '#ef4444',
            '#f59e0b'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  criarGraficoTendencia(): void {
    const ctx = document.getElementById('horasTendenciaChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.horasTendenciaChart) {
      this.horasTendenciaChart.destroy();
    }

    const labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const data = [10, 15, 13, this.totalHorasMes / 4];

    this.horasTendenciaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Horas Lançadas',
          data: data,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
