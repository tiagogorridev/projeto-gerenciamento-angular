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
  showModal: boolean = false;

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
        const diff = end - start;
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

  submitHours(): void {
    // Implement your hours submission logic here
    console.log('Submitting hours:', this.timeTracking);
    this.closeModal();
  }
}
