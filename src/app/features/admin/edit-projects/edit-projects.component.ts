import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';

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
  projectName: string | null = null;

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
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation && navigation['projectName']) {
      this.projectName = navigation['projectName'];
    }

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
    if (this.projectId) {
      this.projectsService.getProjetoById(Number(this.projectId)).subscribe(
        (response: any) => {
          this.projectDetails = {
            name: response.nome || 'Projeto Desconhecido',
            client: response.cliente?.nome || 'Cliente Desconhecido',
            estimatedHours: response.horasEstimadas || 0,
            estimatedCost: response.custoEstimado || 0
          };
        },
        (error) => {
          console.error('Erro ao carregar os detalhes do projeto:', error);
        }
      );
    }
  }

  saveProjectDetails(): void {
    if (this.projectId) {
      const projectIdNumber = Number(this.projectId);

      if (!isNaN(projectIdNumber)) {
        if (this.projectDetails.name && this.projectDetails.client) {
          this.projectsService.updateProjeto(this.projectId, {
            name: this.projectDetails.name,
            client: { name: this.projectDetails.client },
            estimatedHours: this.projectDetails.estimatedHours,
            estimatedCost: this.projectDetails.estimatedCost
          }).subscribe(
            response => {
              console.log('Projeto atualizado com sucesso!', response);
            },
            error => {
              console.error('Erro ao atualizar projeto', error);
            }
          );
        }
      }
    }
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
    if (this.tarefa.nome) {
      this.closeModal();
    }
  }

  onAddMemberSubmit(): void {
    if (this.newMember.email) {
      this.members.push({ ...this.newMember });
      this.newMember = { email: '' };
      this.closeAddMemberModal();
    }
  }
}
