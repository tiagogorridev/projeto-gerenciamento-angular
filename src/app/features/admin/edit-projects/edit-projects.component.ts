import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { HttpErrorResponse } from '@angular/common/http';
interface Cliente {
  id: number;
  nome: string;
}

export interface ProjectDetails {
  name: string;
  client: string | Cliente;
  clientId?: number;
  estimatedHours: number;
  estimatedCost: number;
  status: string;
  priority: string;
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
  projectName: string | null = null;

  projectDetails: ProjectDetails = {
    name: '',
    client: '',
    estimatedHours: 0,
    estimatedCost: 0,
    status: 'EM_ANDAMENTO',
    priority: 'ALTA',
  };

  clients: Cliente[] = [];

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

  tarefas: Tarefa[] = [];

  newMember: Member = { email: '' };
  members: Member[] = [];

  startDate: Date | null = new Date();
  endDate: Date | null = new Date();

  usuariosEmails: string[] = [];

  searchTerm: string = '';
  selectedEmails: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService
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
        this.loadProjectTarefas();
      }
    });

    this.loadClients();
  }

  loadClients(): void {
    this.clienteService.listarClientes().subscribe(
      (clients: Cliente[]) => {
        this.clients = clients;
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao carregar clientes', error);
      }
    );
  }

  loadProjectData(): void {
    if (this.projectId) {
      this.projectsService.getProjetoById(Number(this.projectId)).subscribe(
        (response: any) => {
          console.log('Dados do projeto:', response);

          this.projectDetails = {
            name: response.nome || 'Projeto Desconhecido',
            client: response.cliente || 'Nome do Cliente não disponível',
            clientId: response.id_cliente || null,
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

  loadProjectTarefas(): void {
    if (this.projectId) {
      this.projectsService.getTarefasByProjeto(this.projectId).subscribe(
        (response: Tarefa[]) => {
          this.tarefas = response;
        },
        error => {
          console.error('Erro ao carregar tarefas', error);
        }
      );
    }
  }

  saveProjectDetails(): void {
    const projectData = {
      nome: this.projectDetails.name,
      cliente: this.projectDetails.client,
      horasEstimadas: this.projectDetails.estimatedHours,
      custoEstimado: this.projectDetails.estimatedCost,
      status: this.projectDetails.status,
    };

    if (this.projectId) {
      this.projectsService.updateProjeto(this.projectId, projectData).subscribe(
        (response: any) => {
          console.log('Projeto atualizado com sucesso', response);
          this.projectName = this.projectDetails.name;
          this.loadProjectData();
        },
        error => {
          console.error('Erro ao atualizar projeto', error);
        }
      );
    }
  }

  switchTab(tab: 'tasks' | 'time' | 'details'): void {
    this.activeTab = tab;
  }

  openModal(): void {
    this.showNewTarefaModal = true;
  }

  closeModal(): void {
    this.showNewTarefaModal = false;
  }

  openAddMemberModal(): void {
    this.usuarioService.getEmails().subscribe(
      (emails: string[]) => {
        this.usuariosEmails = emails;
        this.showAddMemberModal = true;
      },
      (error) => {
        console.error('Erro ao carregar emails dos usuários:', error);
      }
    );
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
  }



  onSubmit(): void {
    console.log('Tarefa Criada:', this.tarefa);
    this.tarefa.projeto = { id: Number(this.projectId) };

    if (this.startDate && this.endDate) {
      this.tarefa.dataInicio = this.startDate.toISOString();
      this.tarefa.dataFim = this.endDate.toISOString();
    }

    this.projectsService.createTarefa(this.tarefa).subscribe(
      response => {
        console.log('Tarefa salva com sucesso:', response);
        this.closeModal();
        this.loadProjectTarefas();
      },
      error => {
        console.error('Erro ao salvar tarefa:', error);
      }
    );
  }
}
