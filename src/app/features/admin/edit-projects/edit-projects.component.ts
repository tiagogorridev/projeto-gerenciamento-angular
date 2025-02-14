import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ProjectDetails {
  name: string;
  client: string;
  estimatedHours: number;
  estimatedCost: number;
}

interface Tarefa {
  nome: string;
}

interface Member {
  email: string;
}

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.scss']
})
export class EditProjectsComponent implements OnInit {
  activeTab: 'tasks' | 'time' | 'details' = 'tasks';
  projectId: string | null = null;
  searchTerm: string = '';

  projectDetails: ProjectDetails = {
    name: '',
    client: '',
    estimatedHours: 0,
    estimatedCost: 0,
  };

  showNewTarefaModal: boolean = false;
  showAddMemberModal: boolean = false;
  tarefa: Tarefa = { nome: '' };
  newMember: Member = { email: '' };
  members: Member[] = [];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.loadProjectData();
      }
    });
  }

  switchTab(tab: 'tasks' | 'time' | 'details'): void {
    this.activeTab = tab;
  }

  loadProjectData(): void {
    this.projectDetails = {
      name: 'Teste',
      client: 'teste',
      estimatedHours: 100,
      estimatedCost: 100000,
    };
  }

  saveProjectDetails(): void {
    console.log('Salvando detalhes:', this.projectDetails);
  }

  openModal(): void {
    this.showNewTarefaModal = true;
  }

  closeModal(): void {
    this.showNewTarefaModal = false;
  }

  openAddMemberModal(): void {
    this.showAddMemberModal = true;
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
  }

  onSubmit(): void {
    console.log('Nova tarefa:', this.tarefa);
    this.closeModal();
  }

  onAddMemberSubmit(): void {
    if (this.newMember.email) {
      this.members.push({ ...this.newMember });
      console.log('Novo membro adicionado:', this.newMember);
      this.newMember = { email: '' };
      this.closeAddMemberModal();
    }
  }
}
