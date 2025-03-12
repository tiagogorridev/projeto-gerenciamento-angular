import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { TarefaService } from '../../../core/auth/services/tarefa.service';

@Component({
  selector: 'app-admin-tarefa',
  templateUrl: './admin-tarefa.component.html',
  styleUrls: ['./admin-tarefa.component.scss']
})
export class AdminTarefaComponent implements OnInit {
  idprojeto = 0;
  projectId: string | null = null;
  idtarefa = 0;
  tarefa: any = {};
  tarefas: any[] = [];
  projeto: any = {};
  custoRegistrado: number = 0;
  horasOriginais = 0;
  horasDisponiveisProjeto = 0;
  horasDisponiveis = 0;
  erro = '';
  sucessoMensagem = '';

  statusOpcoes: ('ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA')[] = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PAUSADA'];
  statusMap = {
    ABERTA: 'Aberta',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDA: 'Concluída',
    PAUSADA: 'Pausada'
  };

  constructor(
    private route: ActivatedRoute,
    private tarefaService: TarefaService,
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idtarefa = +this.route.snapshot.paramMap.get('idtarefa')!;
    this.idprojeto = +this.route.snapshot.paramMap.get('idprojeto')!;
    this.carregarTarefa();
    this.carregarHorasDisponiveisProjeto();
  }

  navigateToTarefas(): void {
    this.router.navigate([`/admin/edit-projects`, this.idprojeto]);
  }

  getStatusDisplay(status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA'): string {
    return this.statusMap[status] || status;
  }

  getStatusValue(display: string): 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA' {
    const entry = Object.entries(this.statusMap).find(([key, value]) => value === display);
    return entry ? entry[0] as 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA' : display as 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA';
  }

  carregarTarefa(): void {
    this.tarefaService.getTarefaDetails(this.idprojeto, this.idtarefa).subscribe(
      (data) => {
        this.tarefa = { ...data, nomeOriginal: data.nome };
        this.horasOriginais = +this.tarefa.horasEstimadas || 0;
        this.custoRegistrado = data.custoRegistrado ?? 0;
        this.converterDatas();
        this.carregarProjeto();
      },
      (error) => console.error('Erro ao carregar a tarefa:', error)
    );
  }

  carregarProjeto(): void {
    this.projectsService.getProjetoById(this.idprojeto).subscribe(
      (projetoData) => (this.projeto = projetoData),
      (error) => console.error('Erro ao carregar projeto:', error)
    );
  }

  carregarHorasDisponiveisProjeto(): void {
    this.projectsService.getHorasDisponiveis(this.idprojeto.toString()).subscribe(
      (horas) => {
        this.horasDisponiveisProjeto = horas;
        this.atualizarHorasDisponiveis();
      },
      (error) => console.error('Erro ao carregar horas disponíveis:', error)
    );
  }

  atualizarHorasDisponiveis(): void {
    this.horasDisponiveis = this.horasDisponiveisProjeto + this.horasOriginais;
  }

  validarHoras(): boolean {
    if (+this.tarefa.horasEstimadas !== this.horasOriginais &&
        +this.tarefa.horasEstimadas > this.horasDisponiveis) {
      this.erro = `Horas excedidas. O projeto possui apenas ${this.horasDisponiveis} horas disponíveis.`;
      return false;
    }
    this.erro = '';
    return true;
  }


  validarValorPorHora(): boolean {
    if (this.tarefa.valorPorHora <= 0) {
      this.erro = 'O valor por hora deve ser maior que zero.';
      return false;
    }
    this.erro = '';
    return true;
  }


  validarDatas(): boolean {
    const tarefaInicio = new Date(this.tarefa.dataInicio);
    const tarefaFim = new Date(this.tarefa.dataFim);
    const projetoInicio = new Date(this.projeto.dataInicio + 'T00:00:00');
    const projetoFim = new Date(this.projeto.dataFim + 'T00:00:00');

    tarefaInicio.setHours(0, 0, 0, 0);
    tarefaFim.setHours(0, 0, 0, 0);
    projetoInicio.setHours(0, 0, 0, 0);
    projetoFim.setHours(0, 0, 0, 0);

    console.log('Tarefa: ', tarefaInicio, tarefaFim);
    console.log('Projeto: ', projetoInicio, projetoFim);

    if (tarefaInicio < projetoInicio || tarefaFim > projetoFim) {
      this.erro = `As datas devem estar dentro do período do projeto.`;
      return false;
    }
    if (tarefaFim < tarefaInicio) {
      this.erro = 'A data de fim não pode ser anterior à data de início.';
      return false;
    }
    this.erro = '';
    return true;
  }

  salvarAlteracoes(): void {
    delete this.tarefa.custoRegistrado;

    if (!this.validarHoras() || !this.validarDatas() || !this.validarValorPorHora()) return;

    this.tarefaService.atualizarTarefa(this.idprojeto, this.idtarefa, this.tarefa).subscribe(
      () => {
        this.horasOriginais = +this.tarefa.horasEstimadas || 0;
        this.carregarHorasDisponiveisProjeto();
        this.carregarTarefa();
        this.exibirMensagemSucesso();
      },
      (error) => {
        this.erro = error.status === 400 && error.error?.message ? error.error.message : 'Erro ao atualizar a tarefa. Tente novamente.';
        console.error('Erro ao atualizar a tarefa:', error);
      }
    );
  }

  exibirMensagemSucesso(): void {
    this.sucessoMensagem = 'Alterações salvas com sucesso!';
    setTimeout(() => (this.sucessoMensagem = ''), 3000);
  }

  private converterDatas(): void {
    if (this.tarefa.dataInicio) this.tarefa.dataInicio = new Date(`${this.tarefa.dataInicio}T12:00:00`);
    if (this.tarefa.dataFim) this.tarefa.dataFim = new Date(`${this.tarefa.dataFim}T12:00:00`);
  }
}

