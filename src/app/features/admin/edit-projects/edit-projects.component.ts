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

export interface Tarefa {
  id?: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA';
  projeto: { id: number };
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
    status: 'ABERTA',
    projeto: { id: 0 }
  };

  // Array para armazenar as tarefas carregadas
  tarefas: Tarefa[] = [];

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
        this.loadProjectTarefas(); // Carrega as tarefas do projeto
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
        },
        error => {
          console.error('Erro ao carregar dados do projeto', error);
        }
      );
    }
  }

  // Carrega os membros do projeto (caso a API retorne membros)
  loadProjectMembers(): void {
    if (this.projectId) {
      this.projectsService.getMembrosByProjeto(this.projectId).subscribe(
        (response: any[]) => {
          console.log('Membros carregados:', response);
          this.members = response;
        },
        error => {
          console.error('Erro ao carregar membros', error);
        }
      );
    }
  }

  // Carrega as tarefas do projeto
  loadProjectTarefas(): void {
    if (this.projectId) {
      this.projectsService.getTarefasByProjeto(this.projectId).subscribe(
        (response: Tarefa[]) => {
          console.log('Tarefas carregadas:', response);
          this.tarefas = response;
        },
        error => {
          console.error('Erro ao carregar tarefas', error);
        }
      );
    }
  }

  saveProjectDetails(): void {
    if (this.projectId) {
      this.projectsService.updateProjeto(this.projectId, this.projectDetails).subscribe(
        (response: any) => {
          console.log('Projeto atualizado com sucesso', response);
        },
        error => {
          console.error('Erro ao atualizar projeto', error);
        }
      );
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

  onAddMemberSubmit(): void {
    console.log('Membro Adicionado:', this.newMember);
    this.closeAddMemberModal();
  }

  onSubmit(): void {
    console.log('Tarefa Criada:', this.tarefa);
    // Certifica que o id do projeto está definido
    this.tarefa.projeto = { id: Number(this.projectId) };

    this.projectsService.createTarefa(this.tarefa).subscribe(
      response => {
        console.log('Tarefa salva com sucesso:', response);
        this.closeModal();
        // Atualiza a lista de tarefas após a criação
        this.loadProjectTarefas();
      },
      error => {
        console.error('Erro ao salvar tarefa:', error);
      }
    );
  }
}
