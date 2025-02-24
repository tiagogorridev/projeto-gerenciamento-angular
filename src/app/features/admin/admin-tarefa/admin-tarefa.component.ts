import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isEditMode: boolean = false;
  statusOpcoes: string[] = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PAUSADA'];

  constructor(
    private route: ActivatedRoute,
    private tarefaService: TarefaService
  ) {}

  ngOnInit(): void {
    this.idprojeto = +this.route.snapshot.paramMap.get('idprojeto')!;
    this.idtarefa = +this.route.snapshot.paramMap.get('idtarefa')!;

    console.log('idprojeto:', this.idprojeto);
    console.log('idtarefa:', this.idtarefa);

    this.tarefaService.getTarefaDetails(this.idprojeto, this.idtarefa)
      .subscribe(
        (data) => {
          this.tarefa = data;
          console.log('Tarefa carregada:', this.tarefa);
        },
        (error) => {
          console.error('Erro ao carregar a tarefa:', error);
        }
      );
  }

  editarTarefa(): void {
    this.isEditMode = true;
  }

  salvarAlteracoes(): void {
    this.tarefaService.atualizarTarefa(this.idprojeto, this.idtarefa, this.tarefa)
      .subscribe(
        (data) => {
          this.tarefa = data;
          console.log('Tarefa atualizada:', this.tarefa);
          this.isEditMode = false;
        },
        (error) => {
          console.error('Erro ao atualizar a tarefa:', error);
        }
      );
  }

}
