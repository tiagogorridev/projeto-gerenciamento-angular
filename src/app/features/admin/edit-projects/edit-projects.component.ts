import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';

interface ProjectDetails {
  name: string;
  client: string;
  estimatedHours: number;
  estimatedCost: number;
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
}

interface Tarefa {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA'; // Alinhando com a tabela
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
    status: 'EM_ANDAMENTO',
    priority: 'ALTA',
  };

  showNewTarefaModal: boolean = false;
  showAddMemberModal: boolean = false;

  tarefa: Tarefa = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    responsavel: '',
    status: 'ABERTA'  // Inicializando o campo status com um valor válido
  };

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
        this.loadProjectMembers();
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
            estimatedCost: response.custoEstimado || 0,
            status: response.status || 'EM_ANDAMENTO',
            priority: response.prioridade || 'ALTA',
          };

          console.log('Detalhes do projeto carregados:', this.projectDetails);
        },
        (error) => {
          console.error('Erro ao carregar os detalhes do projeto:', error);
        }
      );
    }
  }

  loadProjectMembers(): void {
    if (this.projectId) {
      this.projectsService.getProjetoById(Number(this.projectId)).subscribe(
        (response: any) => {
          this.members = response || [];
          console.log('Membros do projeto carregados:', this.members);
        },
        (error) => {
          console.error('Erro ao carregar membros do projeto:', error);
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
            custoEstimado: this.projectDetails.estimatedCost,
            status: this.projectDetails.status,
            prioridade: this.projectDetails.priority,
          };

          console.log('Projeto a ser salvo:', updatedProject);

          this.projectsService.updateProjeto(this.projectId, updatedProject).subscribe(
            response => {
              console.log('Projeto atualizado com sucesso!', response);
              this.projectName = this.projectDetails.name;
            },
            error => {
              console.error('Erro ao atualizar projeto', error);
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
    if (this.tarefa.nome && this.tarefa.descricao && this.tarefa.dataInicio && this.tarefa.dataFim && this.tarefa.responsavel) {
      console.log('Nova tarefa:', this.tarefa);
      this.closeModal();
    } else {
      console.log('Preencha todos os campos obrigatórios da tarefa');
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
