import { Component } from '@angular/core';  // Certifique-se de que está assim
import { ActivatedRoute } from '@angular/router';
import { TarefaService } from '../../../core/auth/services/tarefa.service';
import { Tarefa } from '../../../core/auth/services/tarefa.model';

@Component({
  selector: 'app-admin-tarefa',
  templateUrl: './admin-tarefa.component.html',
  styleUrls: ['./admin-tarefa.component.scss']
})
export class AdminTarefaComponent {
  tarefa: Tarefa | null = null;

  constructor(
    private route: ActivatedRoute,
    private tarefaService: TarefaService
  ) {}

  ngOnInit(): void {
    const projetoId = this.route.snapshot.paramMap.get('projetoId');
    const tarefaId = this.route.snapshot.paramMap.get('tarefaId');
    if (projetoId && tarefaId) {
      this.getTarefaDetails(projetoId, tarefaId);
    }
  }

  getTarefaDetails(projetoId: string, tarefaId: string): void {
    this.tarefaService.getTarefaById(projetoId, tarefaId).subscribe(
      (tarefa) => {
        this.tarefa = tarefa;
      },
      (error) => {
        console.error('Erro ao carregar os detalhes da tarefa:', error);
      }
    );
  }
}
