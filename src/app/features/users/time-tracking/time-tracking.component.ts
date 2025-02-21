import { TimeTrackingService } from '../../..//core/auth/services/time-tracking.service.ts.service';
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
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private tarefaService: TarefaService,
    private timeTrackingService: TimeTrackingService
  ) {}

  ngOnInit(): void {
    this.startDate = new Date();
    this.usuarioId = this.getUsuarioIdFromLocalStorage();
    if (this.usuarioId !== null) {
      this.loadProjects();
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

  loadProjects(): void {
    if (this.usuarioId === null) return;

    this.isLoading = true;
    this.projectsService.getProjetosAssociados(this.usuarioId).subscribe({
      next: (projetos) => {
        this.projects = projetos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.errorMessage = 'Erro ao carregar projetos. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  loadTasks(projectId: string): void {
    this.isLoading = true;
    this.tarefaService.getProjectTasksUsers(projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.errorMessage = 'Erro ao carregar tarefas. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  onProjectSelect(): void {
    if (this.selectedProject && this.selectedProject.id) {
      this.loadTasks(this.selectedProject.id);
    } else {
      this.tasks = [];
      this.selectedTask = null;
    }
  }

  validateLaunchData(): boolean {
    if (!this.startDate) {
      this.errorMessage = 'Por favor, selecione uma data';
      return false;
    }
    if (!this.startTime || !this.endTime) {
      this.errorMessage = 'Por favor, preencha os horários de início e fim';
      return false;
    }
    if (!this.selectedProject) {
      this.errorMessage = 'Por favor, selecione um projeto';
      return false;
    }
    if (!this.selectedTask) {
      this.errorMessage = 'Por favor, selecione uma tarefa';
      return false;
    }
    if (!this.description) {
      this.errorMessage = 'Por favor, adicione uma descrição';
      return false;
    }
    return true;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onConfirm(): void {
    if (!this.validateLaunchData()) {
      return;
    }

    this.isLoading = true;
    const launchData = {
      idUsuario: this.usuarioId,
      idProjeto: this.selectedProject.id,
      idTarefa: this.selectedTask,
      data: this.formatDate(this.startDate!),
      horaInicio: this.startTime,
      horaFim: this.endTime,
      horas: this.convertDurationToHours(this.duration),
      descricao: this.description.trim()
    };

    this.timeTrackingService.saveLancamento(launchData).subscribe({
      next: (response) => {
        console.log('Lançamento salvo com sucesso', response);
        this.successMessage = 'Lançamento salvo com sucesso!';
        this.isLoading = false;
        this.onCancel();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Erro ao salvar lançamento', error);
        this.errorMessage = 'Erro ao salvar lançamento. Por favor, verifique os dados e tente novamente.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.startDate = new Date();
    this.startTime = '';
    this.endTime = '';
    this.duration = '';
    this.selectedProject = null;
    this.selectedTask = null;
    this.description = '';
    this.errorMessage = '';
  }

  calculateDuration() {
    if (!this.startTime || !this.endTime) return;

    const start = this.parseTime(this.startTime);
    const end = this.parseTime(this.endTime);

    if (start !== undefined && end !== undefined) {
      let diff = end - start;
      // Se o horário final for menor que o inicial, assume que passou para o dia seguinte
      if (diff < 0) {
        diff += 24 * 60; // Adiciona 24 horas em minutos
      }
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

  convertDurationToHours(duration: string): number {
    if (!duration) return 0;
    const [hours, minutes] = duration.replace('h', '').replace('m', '').trim().split(' ');
    return Number(hours) + (Number(minutes) / 60);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
