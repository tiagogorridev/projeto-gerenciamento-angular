import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { UsuarioService } from '../../../core/auth/services/usuario.service';  // Importe o UsuarioService

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

  tarefas: Tarefa[] = [];

  newMember: Member = { email: '' };
  members: Member[] = [];

  startDate: Date | null = new Date();
  endDate: Date | null = new Date();

  // Array para armazenar os e-mails dos usuários
  usuariosEmails: string[] = [];

  clients: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private usuarioService: UsuarioService  // Injetando o UsuarioService
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
        this.loadProjectTarefas();
      } else {
        console.log('ID do projeto não encontrado na URL');
      }
    });

    // Carregar os e-mails dos usuários ao iniciar
    this.loadUsuariosEmails();
  }

  loadUsuariosEmails(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    console.log('Token JWT encontrado:', token); // Imprimir o token
    this.usuarioService.getEmails().subscribe(
      (emails: string[]) => {
        this.usuariosEmails = emails;
        console.log('E-mails dos usuários carregados:', this.usuariosEmails);
      },
      error => {
        console.error('Erro ao carregar e-mails', error);
      }
    );
  }

  switchTab(tab: 'tasks' | 'time' | 'details'): void {
    this.activeTab = tab;
  }

  selectEmail(email: string): void {
    this.newMember.email = email;
  }

  selectedEmails: string[] = [];  // Array para armazenar os e-mails selecionados


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
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    if (this.selectedEmails.length > 0) {
      // Envie todos os e-mails selecionados para o backend
      this.selectedEmails.forEach(email => {
        this.projectsService.addMembroToProjeto(this.projectId!, email).subscribe(
          response => {
            console.log('Membro Adicionado:', response);
            this.loadProjectMembers(); // Recarrega a lista de membros
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

    // Definir as datas de início e fim da tarefa
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
