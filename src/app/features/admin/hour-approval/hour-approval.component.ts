import { Component, OnInit } from '@angular/core';

interface TimeEntry {
  id: number;
  userName: string;
  userEmail: string;
  projectName: string;
  taskDescription: string;
  hoursLogged: number;
  date: Date;
  status: 'PENDENTE' | 'APROVADO' | 'REPROVADO';
}

interface Project {
  id: number;
  name: string;
}

@Component({
  selector: 'app-hour-approval',
  templateUrl: './hour-approval.component.html',
  styleUrls: ['./hour-approval.component.scss']
})
export class HourApprovalComponent implements OnInit {
  timeEntries: TimeEntry[] = [];
  projects: Project[] = [];
  startDate: Date | null = null;
  selectedProject: number | null = null;
  loading: boolean = false;

  constructor() {}

  ngOnInit() {
    this.loadProjects();
    this.loadTimeEntries();
  }

  loadProjects() {
    this.projects = [
      { id: 1, name: 'Projeto A' },
      { id: 2, name: 'Projeto B' },
      { id: 3, name: 'Projeto C' }
    ];
  }

  loadTimeEntries() {
    this.loading = true;
    this.timeEntries = [
      {
        id: 1,
        userName: 'João Silva',
        userEmail: 'joao.silva@empresa.com',
        projectName: 'Projeto A',
        taskDescription: 'Desenvolvimento de funcionalidade X',
        hoursLogged: 8,
        date: new Date(),
        status: 'PENDENTE'
      },
      {
        id: 2,
        userName: 'Maria Santos',
        userEmail: 'maria.santos@empresa.com',
        projectName: 'Projeto B',
        taskDescription: 'Teste de integração',
        hoursLogged: 6,
        date: new Date(),
        status: 'PENDENTE'
      }
    ];
    this.loading = false;
  }

  async approveHours(entryId: number) {
    try {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000));

      const entry = this.timeEntries.find(e => e.id === entryId);
      if (entry) {
        entry.status = 'APROVADO';
      }
    } catch (error) {
      console.error('Erro ao aprovar horas:', error);
    } finally {
      this.loading = false;
    }
  }

  async rejectHours(entryId: number) {
    try {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000));

      const entry = this.timeEntries.find(e => e.id === entryId);
      if (entry) {
        entry.status = 'REPROVADO';
      }
    } catch (error) {
      console.error('Erro ao reprovar horas:', error);
    } finally {
      this.loading = false;
    }
  }

  filterEntries() {
    this.loading = true;
    const filteredEntries = this.timeEntries.filter(entry => {
      let matchesProject = true;
      let matchesDate = true;

      if (this.selectedProject) {
        matchesProject = entry.projectName === this.projects.find(p => p.id === this.selectedProject)?.name;
      }

      if (this.startDate) {
        matchesDate = entry.date.toDateString() === this.startDate.toDateString();
      }

      return matchesProject && matchesDate;
    });

    this.timeEntries = filteredEntries;
    this.loading = false;
  }

  clearFilters() {
    this.startDate = null;
    this.selectedProject = null;
    this.loadTimeEntries();
  }

  formatHours(hours: number): string {
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDENTE': 'pendente',
      'APROVADO': 'aprovado',
      'REPROVADO': 'reprovado'
    };
    return statusMap[status] || '';
  }
}
