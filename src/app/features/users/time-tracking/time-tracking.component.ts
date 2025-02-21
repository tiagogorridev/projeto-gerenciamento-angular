import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';
import { TarefaService } from '../../../core/auth/services/tarefa.service';
import { Tarefa } from '../../../core/auth/services/tarefa.model';


@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements OnInit {
  startDate: Date | null = null;
  startTime: string = '';
  endTime: string = '';
  duration: string = '';
  projects: Projeto[] = [];

  selectedProject: any;
  selectedTask: any;
  description: string = '';
  usuarioId: number | null = null;
  tasks: Tarefa[] = [];


  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private tarefaService: TarefaService
  ) {}

  ngOnInit(): void {
    this.startDate = new Date();
    this.usuarioId = this.getUsuarioIdFromLocalStorage();
    if (this.usuarioId !== null) {
      this.loadProjects();
    } else {
      console.error('Usuário não encontrado no localStorage');
    }
  }

  getUsuarioIdFromLocalStorage(): number | null {
    const usuarioId = localStorage.getItem('usuario_id');
    return usuarioId ? parseInt(usuarioId, 10) : null;
  }

  loadProjects(): void {
    if (this.usuarioId !== null) {
      this.projectsService.getProjetosAssociados(this.usuarioId).subscribe(projetos => {
        this.projects = projetos;
      });
    }
  }

  loadTasks(projectId: string): void {
    console.log('Carregando tarefas para o projeto:', projectId);
    this.tarefaService.getProjectTasksUsers(projectId).subscribe(
      tasks => {
        console.log('Tarefas recebidas:', tasks);
        this.tasks = tasks;
      },
      error => {
        console.error('Erro ao carregar tarefas:', error);
      }
    );
  }

  onProjectSelect(): void {
    console.log('Projeto selecionado:', this.selectedProject);
    if (this.selectedProject) {
      this.loadTasks(this.selectedProject);
    } else {
      this.tasks = [];
      this.selectedTask = null;
    }
  }

  onConfirm(): void {
    console.log({
      startDate: this.startDate,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      project: this.selectedProject,
      task: this.selectedTask,
      description: this.description
    });
  }

  onCancel(): void {
    this.startDate = null;
    this.startTime = '';
    this.endTime = '';
    this.duration = '';
    this.selectedProject = null;
    this.selectedTask = null;
    this.description = '';
  }

  calculateDuration() {
    const start = this.parseTime(this.startTime);
    const end = this.parseTime(this.endTime);

    if (start !== undefined && end !== undefined) {
      const diff = end - start;
      this.duration = this.formatDuration(diff);
    }
  }

  parseTime(time: string): number | undefined {
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    if (isNaN(hours) || isNaN(minutes)) {
      return undefined;
    }
    return hours * 60 + minutes;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
