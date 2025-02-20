import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { TarefaService } from '../../../core/auth/services/tarefa.service';
import { Projeto } from '../../../core/auth/services/projeto.model';
import { Tarefa } from '../../../core/auth/services/tarefa.model';

@Component({
  selector: 'app-about-projects',
  templateUrl: './about-projects.component.html',
  styleUrls: ['./about-projects.component.scss']
})
export class AboutProjectsComponent implements OnInit {

  projeto!: Projeto;
  tarefas: Tarefa[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private tarefaService: TarefaService
  ) { }

  ngOnInit(): void {
    const projetoId = Number(this.route.snapshot.paramMap.get('id'));

    if (projetoId) {
      this.projectsService.getProjetoById(projetoId).subscribe(projeto => {
        this.projeto = projeto;

        this.tarefaService.getProjectTasksUsers(projetoId.toString()).subscribe(tarefas => {
          this.tarefas = tarefas;
        });
      });
    }
  }
}
