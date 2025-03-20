import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../../../core/auth/services/time-tracking.service.ts.service';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent implements OnInit {
  totalHorasMes: number = 0;
  horasAprovadas: number = 0;
  horasReprovadas: number = 0;
  horasEmAnalise: number = 0;
  dataAtualizacao: string = new Date().toLocaleDateString('pt-BR');
  ultimosLancamentos: any[] = [];
  topProjetos: any[] = [];
  topTarefas: any[] = [];
  usuarioId: number = 0;

  horasStatusChart: any;
  horasTendenciaChart: any;

  constructor(
    private timeTrackingService: TimeTrackingService,
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
  }

  getCurrentUserId(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.id) {
        this.usuarioId = Number(user.id);
        this.carregarDados();
      }
    });
  }

  carregarDados(): void {
    if (this.usuarioId <= 0) return;

    this.timeTrackingService.getLancamentosByUsuario(this.usuarioId).subscribe(lancamentos => {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      const lancamentosMes = lancamentos.filter(l => {
        const dataLancamento = new Date(l.data);
        return dataLancamento >= primeiroDiaMes && dataLancamento <= ultimoDiaMes;
      });

      this.totalHorasMes = this.calcularTotalHoras(lancamentosMes);
      this.horasAprovadas = this.calcularTotalHorasPorStatus(lancamentosMes, 'APROVADO');
      this.horasReprovadas = this.calcularTotalHorasPorStatus(lancamentosMes, 'REPROVADO');
      this.horasEmAnalise = this.calcularTotalHorasPorStatus(lancamentosMes, 'EM_ANALISE');

      this.ultimosLancamentos = lancamentos
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 5)
        .map(l => ({
          id: l.id,
          data: l.data,
          projeto: l.projeto.nome,
          tarefa: l.tarefa.nome,
          horaInicio: l.horaInicio,
          horaFim: l.horaFim,
          duracao: this.calcularDuracao(l.horaInicio, l.horaFim),
          status: l.status
        }));

      const projetoMap = new Map();
      const tarefaMap = new Map();

      lancamentos.forEach(lancamento => {
        const projetoId = lancamento.projeto.id;
        const projetoNome = lancamento.projeto.nome;
        const duracao = this.calcularDuracao(lancamento.horaInicio, lancamento.horaFim);

        if (!projetoMap.has(projetoId)) {
          projetoMap.set(projetoId, {
            id: projetoId,
            nome: projetoNome,
            cliente: lancamento.projeto.cliente?.nome || 'Não especificado',
            prioridade: lancamento.projeto.prioridade || 'MEDIA',
            progresso: 0,
            horasLancadas: 0,
            horasEstimadas: lancamento.projeto.horasEstimadas || 0
          });
        }

        const projeto = projetoMap.get(projetoId);
        projeto.horasLancadas += duracao;
        projeto.progresso = this.calcularProgressoProjeto(projeto);

        const tarefaId = lancamento.tarefa.id;
        const tarefaNome = lancamento.tarefa.nome;

        if (!tarefaMap.has(tarefaId)) {
          tarefaMap.set(tarefaId, {
            id: tarefaId,
            nome: tarefaNome,
            projeto: projetoNome,
            cliente: lancamento.projeto.cliente?.nome || 'Não especificado',
            prioridade: lancamento.tarefa.prioridade || 'MEDIA',
            progresso: 0,
            horasLancadas: 0,
            horasEstimadas: lancamento.tarefa.horasEstimadas || 0
          });
        }

        const tarefa = tarefaMap.get(tarefaId);
        tarefa.horasLancadas += duracao;
        tarefa.progresso = this.calcularProgressoTarefa(tarefa);
      });

      this.topProjetos = Array.from(projetoMap.values())
        .sort((a, b) => b.horasLancadas - a.horasLancadas)
        .slice(0, 3);

      this.topTarefas = Array.from(tarefaMap.values())
        .sort((a, b) => b.horasLancadas - a.horasLancadas)
        .slice(0, 3);

      this.criarGraficos();
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

  calcularDuracao(horaInicio: string, horaFim: string): number {
    const minutoInicio = this.converterParaMinutos(horaInicio);
    const minutoFim = this.converterParaMinutos(horaFim);
    return +(((minutoFim - minutoInicio) / 60).toFixed(1));
  }

  calcularPorcentagem(parte: number, total: number): number {
    return total > 0 ? (parte / total) * 100 : 0;
  }

  calcularProgressoProjeto(projeto: any): number {
    if (!projeto.horasEstimadas || projeto.horasEstimadas === 0) {
      return 0;
    }

    const progresso = (projeto.horasLancadas / projeto.horasEstimadas) * 100;
    return Math.min(Math.round(progresso * 100) / 100, 100);
  }

  calcularProgressoTarefa(tarefa: any): number {
    if (!tarefa.horasEstimadas || tarefa.horasEstimadas === 0) {
      return 0;
    }

    const progresso = (tarefa.horasLancadas / tarefa.horasEstimadas) * 100;
    return Math.min(Math.round(progresso * 100) / 100, 100);
  }

  calcularProgresso(projeto: any): number {
    if (!projeto.horasEstimadas || projeto.horasEstimadas === 0) {
      return 0;
    }

    const tempoRegistrado = projeto.tempoRegistrado || 0;
    const progresso = (tempoRegistrado / projeto.horasEstimadas) * 100;

    return Math.min(Math.round(progresso * 100) / 100, 100);
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

  getStatusClass(status: string): string {
    switch(status) {
      case 'APROVADO':
        return 'status-approved';
      case 'REPROVADO':
        return 'status-rejected';
      case 'EM_ANALISE':
        return 'status-pending';
      default:
        return '';
    }
  }

  getStatusDisplay(status: string): string {
    switch(status) {
      case 'APROVADO':
        return 'Aprovado';
      case 'REPROVADO':
        return 'Reprovado';
      case 'EM_ANALISE':
        return 'Em Análise';
      default:
        return status;
    }
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

    const tendenciaHorasPorSemana: number[] = [];
    const semanasLabels: string[] = [];

    const hoje = new Date();
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const semanas = this.obterSemanasDentroDeMes(primeiroDiaDoMes);

    this.timeTrackingService.getLancamentosByUsuario(this.usuarioId).subscribe(lancamentos => {
      const lancamentosPorSemana = semanas.map(semana =>
        lancamentos.filter(l => this.estaNoIntervalo(l, semana.inicio, semana.fim))
      );

      const tendenciaHorasPorSemana = lancamentosPorSemana.map(semanaDeLancamentos =>
        this.calcularTotalHoras(semanaDeLancamentos)
      );

      const semanasLabels = semanas.map((semana, index) => {
        const inicio = semana.inicio.getDate().toString().padStart(2, '0');
        const fim = semana.fim.getDate().toString().padStart(2, '0');
        return `Semana ${index + 1} (${inicio}-${fim}/${(semana.inicio.getMonth() + 1).toString().padStart(2, '0')})`;
      });

      this.horasTendenciaChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: semanasLabels,
          datasets: [{
            label: 'Horas Lançadas',
            data: tendenciaHorasPorSemana,
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
              beginAtZero: true,
              title: {
                display: true,
                text: 'Horas'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Horas: ${context.parsed.y.toFixed(1)}h`;
                }
              }
            }
          }
        }
      });
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

  obterSemanasDentroDeMes(primeiroDiaDoMes: Date): { inicio: Date, fim: Date }[] {
    const semanas: { inicio: Date, fim: Date }[] = [];
    const ultimoDiaDoMes = new Date(primeiroDiaDoMes.getFullYear(), primeiroDiaDoMes.getMonth() + 1, 0);

    let diaAtual = new Date(primeiroDiaDoMes);

    while (diaAtual <= ultimoDiaDoMes) {
      const inicioDaSemana = new Date(diaAtual);

      const fimDaSemana = new Date(inicioDaSemana);
      fimDaSemana.setDate(inicioDaSemana.getDate() + 6);

      if (fimDaSemana > ultimoDiaDoMes) {
        semanas.push({ inicio: inicioDaSemana, fim: new Date(ultimoDiaDoMes) });
        break;
      } else {
        semanas.push({ inicio: inicioDaSemana, fim: fimDaSemana });
      }

      diaAtual = new Date(fimDaSemana);
      diaAtual.setDate(diaAtual.getDate() + 1);
    }

    return semanas;
  }

  estaNoIntervalo(lancamento: any, dataInicio: Date, dataFim: Date): boolean {
    const dataLancamento = new Date(lancamento.data);
    return dataLancamento >= dataInicio && dataLancamento <= dataFim;
  }
}
