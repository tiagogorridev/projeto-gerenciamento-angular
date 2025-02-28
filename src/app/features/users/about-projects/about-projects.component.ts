import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { TarefaService } from '../../../core/auth/services/tarefa.service';
import { TimeTrackingService } from '../../../core/auth/services/time-tracking.service.ts.service';
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
  showModal: boolean = false;
  usuarioId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  timeTracking = {
    startDate: new Date(),
    startTime: '',
    endTime: '',
    duration: '',
    selectedTask: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private tarefaService: TarefaService,
    private timeTrackingService: TimeTrackingService
  ) { }

  ngOnInit(): void {
    const projetoId = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioId = this.getUsuarioIdFromLocalStorage();

    if (projetoId) {
      this.projectsService.getProjetoById(projetoId).subscribe(projeto => {
        this.projeto = projeto;

        this.tarefaService.getProjectTasksUsers(projetoId.toString()).subscribe(tarefas => {
          this.tarefas = tarefas;
        });
      });
    }
  }

  getUsuarioIdFromLocalStorage(): number | null {
    const usuarioId = localStorage.getItem('usuario_id');
    return usuarioId ? parseInt(usuarioId, 10) : null;
  }

  openAddHoursModal(): void {
    this.showModal = true;
    this.timeTracking.startDate = new Date();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetTimeTracking();
  }

  resetTimeTracking(): void {
    this.timeTracking = {
      startDate: new Date(),
      startTime: '',
      endTime: '',
      duration: '',
      selectedTask: '',
      description: ''
    };
  }

  calculateDuration(): void {
    if (this.timeTracking.startTime && this.timeTracking.endTime) {
      const start = this.parseTime(this.timeTracking.startTime);
      const end = this.parseTime(this.timeTracking.endTime);

      if (start !== undefined && end !== undefined) {
        let diff = end - start;
        if (diff < 0) {
          diff += 24 * 60;
        }
        this.timeTracking.duration = this.formatDuration(diff);
      }
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

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  convertDurationToHours(duration: string): number {
    if (!duration) return 0;
    const [hours, minutes] = duration.replace('h', '').replace('m', '').trim().split(' ');
    return Number(hours) + (Number(minutes) / 60);
  }

  validateLaunchData(): boolean {
    if (!this.timeTracking.startDate) {
      this.errorMessage = 'Por favor, selecione uma data';
      return false;
    }
    if (!this.timeTracking.startTime || !this.timeTracking.endTime) {
      this.errorMessage = 'Por favor, preencha os horários de início e fim';
      return false;
    }
    if (!this.projeto || !this.projeto.id) {
      this.errorMessage = 'Projeto não identificado';
      return false;
    }
    if (!this.timeTracking.selectedTask) {
      this.errorMessage = 'Por favor, selecione uma tarefa';
      return false;
    }
    if (!this.timeTracking.description) {
      this.errorMessage = 'Por favor, adicione uma descrição';
      return false;
    }
    return true;
  }

  submitHours(): void {
    if (!this.validateLaunchData()) {
      return;
    }

    let formattedDate: string;
    if (typeof this.timeTracking.startDate === 'string') {
      formattedDate = this.timeTracking.startDate;
    } else {
      formattedDate = this.formatDate(this.timeTracking.startDate);
    }

    const launchData = {
      idUsuario: this.usuarioId,
      idProjeto: this.projeto.id,
      idTarefa: this.timeTracking.selectedTask,
      data: formattedDate,
      horaInicio: this.timeTracking.startTime,
      horaFim: this.timeTracking.endTime,
      horas: this.convertDurationToHours(this.timeTracking.duration),
      descricao: this.timeTracking.description.trim()
    };

    this.timeTrackingService.saveLancamento(launchData).subscribe({
      next: (response) => {
        console.log('Lançamento salvo com sucesso', response);
        this.successMessage = 'Lançamento salvo com sucesso!';
        this.closeModal();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Erro ao salvar lançamento', error);
        this.errorMessage = 'Erro ao salvar lançamento. Por favor, verifique os dados e tente novamente.';
      }
    });
  }
}
