import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { ProjectMemberService } from '../../../core/auth/services/project-member.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  status?: string;
}
export interface ProjectDetails {
  name: string;
  client: string;
  clientId: number | undefined;
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
  horasEstimadas: number;
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
  selectedUserId: number | null = null;
  projectDetails: ProjectDetails = {
    name: '',
    client: '',
    clientId: undefined,
    estimatedHours: 0,
    estimatedCost: 0,
    status: 'EM_ANDAMENTO',
    priority: 'ALTA',
  };

  clients: Cliente[] = [];
  showNewTarefaModal: boolean = false;
  showAddMemberModal: boolean = false;
  horasDisponiveis: number = 0;

  tarefa: Tarefa = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    responsavel: '',
    status: 'ABERTA',
    projeto: { id: 0 },
    horasEstimadas: 0
  };

  tarefas: Tarefa[] = [];
  newMember: Member = { email: '' };
  members: Member[] = [];
  startDate: Date | null = new Date();
  endDate: Date | null = new Date();
  usuariosEmails: string[] = [];
  searchTerm: string = '';
  selectedEmails: string[] = [];
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private projectMemberService: ProjectMemberService
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
        this.loadProjectMembers();
        this.carregarHorasDisponiveis();
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
            name: response.nome,
            client: response.cliente ? response.cliente.nome : 'Nome do Cliente não disponível',
            clientId: response.cliente ? response.cliente.id : undefined,
            estimatedHours: response.horasEstimadas,
            estimatedCost: response.custoEstimado,
            status: response.status,
            priority: response.prioridade
          };
        },
        (error: Error) => {
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

  loadProjectMembers(): void {
    if (this.projectId) {
      this.projectMemberService.getProjectMembers(Number(this.projectId)).subscribe({
        next: (members) => {
          this.members = members;
          console.log('Membros atualizados:', members);
        },
        error: (error) => {
          console.error('Erro ao carregar membros do projeto:', error);
        }
      });
    }
  }

  saveProjectDetails(): void {
    const projectData = {
      nome: this.projectDetails.name,
      cliente: this.projectDetails.client,
      horasEstimadas: this.projectDetails.estimatedHours,
      custoEstimado: this.projectDetails.estimatedCost,
      status: this.projectDetails.status,
      prioridade: this.projectDetails.priority
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
    this.carregarHorasDisponiveis();
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
    this.selectedEmails = [];
  }

  addMembers(): void {
    if (!this.projectId || !this.selectedEmails.length) {
      return;
    }

    const projectId = Number(this.projectId);
    let processedCount = 0;

    this.selectedEmails.forEach(email => {
      this.projectMemberService.getUserIdByEmail(email).subscribe({
        next: (userId) => {
          if (userId) {
            this.projectsService.addMemberToProject(userId, projectId).subscribe({
              next: () => {
                processedCount++;
                if (processedCount === this.selectedEmails.length) {
                  this.loadProjectMembers();
                  this.closeAddMemberModal();
                }
              },
              error: (error) => {
                processedCount++;
                if (error.error === 'O usuário já está associado a este projeto') {
                  this.showError(`Usuário ${email} já é membro do projeto`);
                } else {
                  this.showError(`Erro ao adicionar ${email}`);
                }

                if (processedCount === this.selectedEmails.length) {
                  this.loadProjectMembers();
                  this.closeAddMemberModal();
                }
              }
            });
          }
        },
        error: (err) => {
          processedCount++;
          this.showError(`Erro ao processar usuário ${email}`);
        }
      });
    });
  }

  onSubmit(): void {
    this.carregarHorasDisponiveis();

    if (this.tarefa.horasEstimadas > this.horasDisponiveis) {
      this.showError(`Horas estimadas (${this.tarefa.horasEstimadas}) excedem o limite disponível do projeto (${this.horasDisponiveis})`);
      return;
    }

    if (!this.projectId || !this.startDate || !this.endDate) {
      this.showError('Dados incompletos para criar a tarefa');
      return;
    }

    this.tarefa.projeto = { id: Number(this.projectId) };
    this.tarefa.dataInicio = this.startDate.toISOString();
    this.tarefa.dataFim = this.endDate.toISOString();

    this.projectsService.createTarefa(this.tarefa).subscribe(
      response => {
        console.log('Tarefa salva com sucesso:', response);
        this.closeModal();
        this.loadProjectTarefas();
        this.carregarHorasDisponiveis();
        this.resetTarefaForm();
      },
      error => {
        console.error('Erro ao salvar tarefa:', error);
        if (error instanceof HttpErrorResponse) {
          this.showError(error.error?.message || 'Erro ao criar tarefa');
        }
      }
    );
  }

  addUserToProject(): void {
    if (this.projectId && this.selectedUserId) {
      this.projectsService.addMemberToProject(Number(this.projectId), this.selectedUserId).subscribe(
          (response) => {
            console.log('Usuário adicionado ao projeto com sucesso', response);
            this.loadProjectMembers();
          },
          (error) => {
            console.error('Erro ao adicionar usuário ao projeto', error);
          }
        );
    }
  }

  removeMember(email: string): void {
    if (!this.projectId) return;

    this.projectMemberService.getUserIdByEmail(email).subscribe({
      next: (userId) => {
        if (userId) {
          this.projectMemberService.removeProjectMember(Number(this.projectId), userId).subscribe({
            next: (response) => {
              console.log('Membro removido com sucesso');
              this.loadProjectMembers();
            },
            error: (err) => {
              if (err.status !== 200) {
                console.error('Erro ao remover membro:', err);
                this.showError('Erro ao remover membro do projeto');
              } else {
                this.loadProjectMembers();
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao obter ID do usuário:', err);
        this.showError('Erro ao encontrar usuário');
      }
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorMessage = true;
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 3000);
  }

  deleteTarefa(tarefaId: number | undefined): void {
    if (!tarefaId) return;

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.projectsService.deleteTarefa(tarefaId).subscribe({
        next: () => {
          console.log('Tarefa excluída com sucesso');
          this.loadProjectTarefas();
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
          this.showError('Erro ao excluir tarefa');
        }
      });
    }
  }

  carregarHorasDisponiveis() {
    if (this.projectId) {
      this.projectsService.getHorasDisponiveis(this.projectId).subscribe(
        (horas) => {
          this.horasDisponiveis = horas;
          console.log('Horas disponíveis atualizadas:', this.horasDisponiveis);
        },
        (error) => {
          console.error('Erro ao carregar horas disponíveis:', error);
          this.showError('Erro ao carregar horas disponíveis do projeto');
        }
      );
    }
  }

  resetTarefaForm(): void {
    this.tarefa = {
      nome: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      responsavel: '',
      status: 'ABERTA',
      projeto: { id: 0 },
      horasEstimadas: 0
    };
    this.startDate = new Date();
    this.endDate = new Date();
  }
}
