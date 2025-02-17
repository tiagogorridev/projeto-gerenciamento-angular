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

  clients: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];

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
      console.log('Project ID recuperado:', this.projectId);
      if (this.projectId) {
        this.loadProjectData();
      } else {
        console.log('ID do projeto não encontrado na URL');
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
          console.log('Resposta do servidor:', response);

          this.projectDetails = {
            name: response.nome || 'Projeto Desconhecido',
            client: response.cliente?.nome || 'Cliente Desconhecido',
            estimatedHours: response.horasEstimadas || 0,
            estimatedCost: response.custoEstimado || 0
          };

          console.log('Detalhes do projeto carregados:', this.projectDetails);
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
          const updatedProject = {
            nome: this.projectDetails.name,
            cliente: { nome: this.projectDetails.client },
            horasEstimadas: this.projectDetails.estimatedHours,
            custoEstimado: this.projectDetails.estimatedCost
          };

          this.projectsService.updateProjeto(this.projectId, updatedProject).subscribe(
            response => {
              console.log('Projeto atualizado com sucesso!', response);
            },
            error => {
              console.error('Erro ao atualizar projeto', error);
              if (error.error) {
                console.error('Erro detalhado do servidor:', error.error);
              }
            }
          );
        } else {
          console.error('Campos obrigatórios não preenchidos');
        }
      } else {
        console.error('ID do projeto inválido');
      }
    } else {
      console.error('ID do projeto não encontrado');
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
      console.log('Nova tarefa:', this.tarefa);
      this.closeModal();
    } else {
      console.log('Nome da tarefa não pode estar vazio');
    }
  }

  onAddMemberSubmit(): void {
    if (this.newMember.email) {
      this.members.push({ ...this.newMember });
      console.log('Novo membro adicionado:', this.newMember);
      this.newMember = { email: '' };
      this.closeAddMemberModal();
    } else {
      console.log('Email do membro não pode estar vazio');
    }
  }
}
