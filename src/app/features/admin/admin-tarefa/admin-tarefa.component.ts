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
  isEditMode: boolean = false;
  statusOpcoes: string[] = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PAUSADA'];

  constructor(
    private route: ActivatedRoute,
    private tarefaService: TarefaService,
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idprojeto = +this.route.snapshot.paramMap.get('idprojeto')!;
    this.idtarefa = +this.route.snapshot.paramMap.get('idtarefa')!;

    this.tarefaService.getTarefaDetails(this.idprojeto, this.idtarefa)
      .subscribe(
        (data) => {
          this.tarefa = data;
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
          this.isEditMode = false;
        },
        (error) => {
          console.error('Erro ao atualizar a tarefa:', error);
        }
      );
  }

  excluirTarefa(): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.projectsService.deleteTarefa(this.idtarefa)
        .subscribe(
          () => {
            alert('Tarefa excluída com sucesso!');
            this.router.navigate([`/projetos/${this.idprojeto}`]);
          },
          (error) => {
            console.error('Erro ao excluir a tarefa:', error);
            alert('Erro ao excluir a tarefa.');
          }
        );
    }
  }
}
