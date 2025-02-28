import { ProjectsService } from './../../../core/auth/services/projects.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TarefaService } from '../../../core/auth/services/tarefa.service';

@Component({
  selector: 'app-admin-tarefa',
  templateUrl: './admin-tarefa.component.html',
  styleUrls: ['./admin-tarefa.component.scss']
})
export class AdminTarefaComponent implements OnInit {
  idprojeto: number = 0;
  idtarefa: number = 0;
  tarefa: any = {};
  statusOpcoes: ('ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA')[] = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PAUSADA'];
  projeto: any = {};

  horasOriginais: number = 0;
  horasDisponiveisProjeto: number = 0;
  horasDisponiveis: number = 0;
  erro: string = '';
  sucessoMensagem: string = '';

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
    this.tarefaService.getTarefaDetails(this.idprojeto, this.idtarefa)
      .subscribe(
        (data) => {
          this.tarefa = data;
          this.tarefa.nomeOriginal = data.nome;
          this.horasOriginais = parseFloat(this.tarefa.horasEstimadas || 0);

          if (this.tarefa.dataInicio) {
            const dataInicioStr = this.tarefa.dataInicio + 'T12:00:00';
            this.tarefa.dataInicio = new Date(dataInicioStr);
          }
          if (this.tarefa.dataFim) {
            const dataFimStr = this.tarefa.dataFim + 'T12:00:00';
            this.tarefa.dataFim = new Date(dataFimStr);
          }

          this.projectsService.getProjetoById(this.idprojeto).subscribe(
            (projetoData) => {
              this.projeto = projetoData;
            },
            (error) => {
              console.error('Erro ao carregar projeto:', error);
            }
          );
        },
        (error) => {
          console.error('Erro ao carregar a tarefa:', error);
        }
      );
  }

  carregarHorasDisponiveisProjeto(): void {
    this.projectsService.getHorasDisponiveis(this.idprojeto.toString())
      .subscribe(
        (horas) => {
          this.horasDisponiveisProjeto = horas;
          this.atualizarHorasDisponiveis();
        },
        (error) => {
          console.error('Erro ao carregar horas disponíveis:', error);
        }
      );
  }

  atualizarHorasDisponiveis(): void {
    this.horasDisponiveis = this.horasDisponiveisProjeto + this.horasOriginais;
  }

  validarHoras(): boolean {
    const horasAtualizadas = parseFloat(this.tarefa.horasEstimadas || 0);

    if (horasAtualizadas > this.horasDisponiveis) {
      this.erro = `Horas excedidas. O projeto possui apenas ${this.horasDisponiveis} horas disponíveis.`;
      return false;
    }

    this.erro = '';
    return true;
  }

  validarDatas(): boolean {
    const dataInicio = new Date(this.tarefa.dataInicio);
    const dataFim = new Date(this.tarefa.dataFim);

    const dataInicioProjeto = new Date(this.projeto.dataInicio);
    const dataFimProjeto = new Date(this.projeto.dataFim);

    if (dataInicio < dataInicioProjeto || dataFim > dataFimProjeto) {
      this.erro = `As datas de início ou fim da tarefa estão fora do período do projeto (de ${dataInicioProjeto.toLocaleDateString()} a ${dataFimProjeto.toLocaleDateString()}).`;
      return false;
    }

    if (dataFim < dataInicio) {
      this.erro = 'A data de fim não pode ser anterior à data de início.';
      return false;
    }

    this.erro = '';
    return true;
  }

  salvarAlteracoes(): void {
    this.erro = '';
    this.sucessoMensagem = '';

    if (!this.validarHoras() || !this.validarDatas()) {
      return;
    }

    this.tarefaService.atualizarTarefa(this.idprojeto, this.idtarefa, this.tarefa)
      .subscribe(
        (data) => {
          console.log('Data returned from update:', data);
          console.log('Date types before conversion:', {
            dataInicio: typeof data.dataInicio,
            dataFim: typeof data.dataFim
          });

          if (this.tarefa.dataInicio) {
            this.tarefa.dataInicio = new Date(this.tarefa.dataInicio);
          }
          if (this.tarefa.dataFim) {
            this.tarefa.dataFim = new Date(this.tarefa.dataFim);
          }

          this.horasOriginais = parseFloat(this.tarefa.horasEstimadas || 0);
          this.carregarHorasDisponiveisProjeto();
          this.sucessoMensagem = 'Alterações salvas com sucesso!';
          setTimeout(() => {
            this.sucessoMensagem = '';
          }, 3000);

          console.log('Date types after conversion:', {
            dataInicio: typeof this.tarefa.dataInicio,
            dataFim: typeof this.tarefa.dataFim
          });
        },
        (error) => {
          if (error.status === 400 && error.error && error.error.message) {
            this.erro = error.error.message;
          } else {
            this.erro = 'Erro ao atualizar a tarefa. Tente novamente.';
            console.error('Erro ao atualizar a tarefa:', error);
          }
        }
      );
  }

  carregarTempoRegistrado(): void {
    this.tarefaService.getTempoRegistrado(this.idprojeto, this.idtarefa)
      .subscribe(
        (tempo) => {
          this.tarefa.tempoRegistrado = tempo;
        },
        (error) => {
          console.error('Erro ao carregar tempo registrado:', error);
        }
      );
  }
}
