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
    private clienteService: ClienteService  // Adicione o ClienteService aqui
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
        this.loadProjectMembers();
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

  loadProjectMembers(): void {
    if (this.projectId) {
      this.projectsService.getMembrosByProjeto(this.projectId).subscribe(
        (response: any[]) => {
          this.members = response;
        },
        error => {
          console.error('Erro ao carregar membros', error);
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
    this.showAddMemberModal = true;
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
  }

  onAddMemberSubmit(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    if (this.selectedEmails.length > 0) {
      this.selectedEmails.forEach(email => {
        this.projectsService.addMembroToProjeto(this.projectId!, email).subscribe(
          response => {
            console.log('Membro Adicionado:', response);
            this.loadProjectMembers();
          },
          error => {
            console.error('Erro ao adicionar membro', error);
          }
        );
      });

      this.closeAddMemberModal();
    } else {
      console.error('Nenhum e-mail selecionado.');
    }
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
