import { TarefaService } from './../../../core/auth/services/tarefa.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { ClienteService } from '../../../core/auth/services/clients.service';
import { ProjectMemberService } from '../../../core/auth/services/project-member.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/services/auth.service';


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
  registeredCost: number;
  startDate?: string;
  endDate?: string;
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
  tempoRegistrado?: number;
  usuarioResponsavel?: {
    id: number;
    nome?: string;
    email?: string;
  };
  valorPorHora: number;
  custoRegistrado: number;
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
  currentUserName: string = '';
  currentUserEmail: string = '';
  currentUserId: number | null = null;
  projectDetails: ProjectDetails = {
    name: '',
    client: '',
    clientId: undefined,
    registeredCost: 0,
    estimatedHours: 0,
    estimatedCost: 0,
    status: 'EM_ANDAMENTO',
    priority: 'ALTA',
  };

  clients: Cliente[] = [];
  showNewTarefaModal: boolean = false;
  showAddMemberModal: boolean = false;
  horasDisponiveis: number = 0;

  showDeleteTarefaModal: boolean = false;
  selectedTarefa: any = null;

  originalTarefas: Tarefa[] = [];
  originalMembers: Member[] = [];

  startDateError: string = '';
  endDateError: string = '';

  horasRegistradas: number = 0;

  tarefa: Tarefa = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    responsavel: '',
    status: 'ABERTA',
    projeto: { id: 0 },
    horasEstimadas: 0,
    tempoRegistrado: 0,
    valorPorHora: 0,
    custoRegistrado: 0
  };

  tarefas: Tarefa[] = [];
  newMember: Member = { email: '' };
  members: Member[] = [];
  startDate: Date | null = new Date();
  endDate: Date | null = new Date();

  startDateCalendar: Date | null = null;
  endDateCalendar: Date | null = null;

  usuariosEmails: string[] = [];
  searchTerm: string = '';
  selectedEmails: string[] = [];
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';



  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private projectMemberService: ProjectMemberService,
    private router: Router,
    private authService: AuthService,
    private tarefaService: TarefaService
  ) {
  }

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation && navigation['projectName']) {
      this.projectName = navigation['projectName'];
    }

    this.loadCurrentUserInfo();

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

  openDeleteTarefaModal(tarefa: any): void {
    this.selectedTarefa = tarefa;
    this.showDeleteTarefaModal = true;
  }

  closeDeleteTarefaModal(): void {
    this.showDeleteTarefaModal = false;
    this.selectedTarefa = null;
  }

  confirmDeleteTarefa(): void {
    if (this.selectedTarefa && this.selectedTarefa.id) {
      this.tarefaService.deleteTarefa(this.selectedTarefa.id).subscribe({
        next: () => {
          this.successMessage = 'Tarefa excluída com sucesso!';
          this.closeDeleteTarefaModal();
          this.loadProjectTarefas();
        },
        error: (error: any) => {
          console.error('Erro ao excluir tarefa:', error);
          this.errorMessage = 'Erro ao excluir tarefa. Tente novamente.';
        }
      });
    }
  }

  registrarTempo(tarefaId: number): void {
    if (this.horasRegistradas <= 0) {
      this.showError('Por favor, insira um valor válido de horas.');
      return;
    }

    this.tarefaService.registrarTempo(tarefaId, this.horasRegistradas).subscribe({
      next: (tarefaAtualizada) => {
        console.log('Tempo registrado com sucesso', tarefaAtualizada);

        const index = this.tarefas.findIndex(t => t.id === tarefaId);
        if (index !== -1) {
          this.tarefas[index] = tarefaAtualizada;
        }


        this.saveProjectDetails();

        this.horasRegistradas = 0;
        this.showError('Tempo registrado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao registrar tempo', error);
        this.showError('Erro ao registrar tempo. Tente novamente.');
      }
    });
  }

  loadCurrentUserInfo(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.currentUserName = user.nome || user.nomeCompleto || '';
          this.currentUserEmail = user.email || '';
          this.currentUserId = user.id ? Number(user.id) : null;

          this.tarefa.responsavel = this.currentUserName;
        }
      },
      (error) => {
        console.error('Erro ao carregar informações do usuário atual:', error);
      }
    );
  }

  navigateToProjetos(): void {
    this.router.navigate(['/admin/admin-projetos']);
  }

  navigateToTask(tarefaId: number): void {
    this.router.navigate([`edit-projects`, this.projectId, tarefaId]);
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
          this.projectName = response.nome;
          this.projectDetails = {
            name: response.nome,
            client: response.cliente ? response.cliente.nome : 'Nome do Cliente não disponível',
            clientId: response.cliente ? response.cliente.id : undefined,
            estimatedHours: response.horasEstimadas,
            estimatedCost: response.custoEstimado,
            registeredCost: response.custoRegistrado || 0,
            status: response.status,
            priority: response.prioridade,
            startDate: response.dataInicio ? new Date(response.dataInicio).toISOString().split('T')[0] : undefined,
            endDate: response.dataFim ? new Date(response.dataFim).toISOString().split('T')[0] : undefined
          };

          if (this.projectDetails.startDate) {
            this.startDateCalendar = new Date(this.projectDetails.startDate + 'T00:00:00');
          }

          if (this.projectDetails.endDate) {
            this.endDateCalendar = new Date(this.projectDetails.endDate + 'T00:00:00');
          }

          console.log('Projeto carregado:', this.projectDetails);
        },
        (error: Error) => {
          console.error('Erro ao carregar dados do projeto', error);
        }
      );
    }
  }

  onStartDateChange(event: any): void {
    if (event) {
      const date = new Date(event);
      this.projectDetails.startDate = date.toISOString().substring(0, 10);

      this.startDateError = '';

      if (this.startDateCalendar && this.endDateCalendar) {
        const selectedDate = new Date(date);
        const projectStart = new Date(this.startDateCalendar);
        const projectEnd = new Date(this.endDateCalendar);
      }

      if (this.endDate && date > this.endDate) {
        this.endDateError = 'Data final deve ser posterior à data inicial';
      }
    } else {
      this.projectDetails.startDate = undefined;
      this.startDateError = '';
    }
  }

  onEndDateChange(event: any): void {
    if (event) {
      const date = new Date(event);
      this.projectDetails.endDate = date.toISOString().substring(0, 10);

      this.endDateError = '';

      if (this.startDateCalendar && this.endDateCalendar) {
        const selectedDate = new Date(date);
        const projectStart = new Date(this.startDateCalendar);
        const projectEnd = new Date(this.endDateCalendar);
      }

      if (this.startDate && date < this.startDate) {
        this.endDateError = 'Data final deve ser posterior à data inicial';
      }
    } else {
      this.projectDetails.endDate = undefined;
      this.endDateError = '';
    }
  }

  loadProjectTarefas(): void {
    if (this.projectId) {
      this.projectsService.getTarefasByProjeto(this.projectId).subscribe(
        (response: Tarefa[]) => {
          this.originalTarefas = response.map(tarefa => {
            return {
              ...tarefa,
              responsavel: tarefa.usuarioResponsavel?.nome || tarefa.responsavel || 'Não atribuído'
            };
          });
          this.tarefas = [...this.originalTarefas];

          this.tarefas.forEach(tarefa => {
            if (tarefa.id) {
            }
          });
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
          // Os membros já vêm filtrados do serviço (apenas ativos)
          this.originalMembers = members;
          this.members = [...this.originalMembers];
          console.log('Membros ativos:', this.members);
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
      prioridade: this.projectDetails.priority,
      dataInicio: this.projectDetails.startDate ? new Date(this.projectDetails.startDate).toISOString() : undefined,
      dataFim: this.projectDetails.endDate ? new Date(this.projectDetails.endDate).toISOString() : undefined,
      custoRegistrado: this.projectDetails.registeredCost
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
    this.tarefa.responsavel = this.currentUserName;
    this.showNewTarefaModal = true;
  }

  openAddMemberModal(): void {
    this.usuarioService.getEmails().subscribe(
      (emails: string[]) => {
        const existingMemberEmails = this.members.map(member => member.email.toLowerCase());
        this.usuariosEmails = emails.filter(email => !existingMemberEmails.includes(email.toLowerCase()));
        this.showAddMemberModal = true;
        this.selectedEmails = [];
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
    let successCount = 0;

    this.selectedEmails.forEach(email => {
      this.projectMemberService.getUserIdByEmail(email).subscribe({
        next: (userId) => {
          if (userId) {
            this.projectsService.addMemberToProject(userId, projectId).subscribe({
              next: () => {
                processedCount++;
                successCount++;

                if (processedCount === this.selectedEmails.length) {
                  if (successCount > 0) {
                    this.loadProjectMembers();
                  }
                  this.closeAddMemberModal();
                }
              },
              error: (error) => {
                processedCount++;
                if (processedCount === this.selectedEmails.length) {
                  if (successCount > 0) {
                    this.loadProjectMembers();
                  }
                  this.closeAddMemberModal();
                }
              }
            });
          }
        },
        error: (err) => {
          processedCount++;
          this.showError(`Erro ao processar usuário ${email}`);

          if (processedCount === this.selectedEmails.length) {
            if (successCount > 0) {
              this.loadProjectMembers();
            }
            this.closeAddMemberModal();
          }
        }
      });
    });
  }


  onSubmit(): void {
    this.carregarHorasDisponiveis();

    const areDatesEqual = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const isDateWithinRange = (date: Date, start: Date, end: Date): boolean => {
      const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      return (compareDate >= startDate && compareDate <= endDate) ||
             areDatesEqual(compareDate, startDate) ||
             areDatesEqual(compareDate, endDate);
    };

    if (this.startDate && this.endDate) {
      if (this.endDate < this.startDate) {
        this.endDateError = 'Data final deve ser posterior à data inicial';
        return;
      }

      if (this.startDateCalendar && this.endDateCalendar) {
        const projectStart = new Date(this.startDateCalendar);
        const projectEnd = new Date(this.endDateCalendar);

        console.log('Project Start:', projectStart);
        console.log('Project End:', projectEnd);
        console.log('Task Start:', this.startDate);
        console.log('Task End:', this.endDate);

        if (!isDateWithinRange(this.startDate, projectStart, projectEnd)) {
          this.startDateError = 'Data de início fora do período do projeto';
          return;
        }

        if (!isDateWithinRange(this.endDate, projectStart, projectEnd)) {
          this.endDateError = 'Data final fora do período do projeto';
          return;
        }
      }
    }

    if (this.tarefa.horasEstimadas > this.horasDisponiveis) {
      this.showError(`Horas estimadas (${this.tarefa.horasEstimadas}) excedem o limite disponível do projeto (${this.horasDisponiveis})`);
      return;
    }

    if (!this.projectId || !this.startDate || !this.endDate || !this.currentUserId) {
      this.showError('Dados incompletos para criar a tarefa');
      return;
    }

    this.tarefa.responsavel = this.currentUserName;
    this.tarefa.projeto = { id: Number(this.projectId) };
    this.tarefa.usuarioResponsavel = {
      id: this.currentUserId,
      nome: this.currentUserName
    };

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


  filterTarefas(): void {
    if (this.searchTerm.trim() === '') {
      this.tarefas = [...this.originalTarefas];
    } else {
      this.tarefas = this.originalTarefas.filter(tarefa =>
        tarefa.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tarefa.responsavel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tarefa.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filterMembers(): void {
    if (this.searchTerm.trim() === '') {
      this.members = [...this.originalMembers];
    } else {
      this.members = this.originalMembers.filter(member =>
        member.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addUserToProject(): void {
    if (this.projectId && this.selectedEmails && this.selectedEmails.length > 0) {
      this.addMembers();
    } else {
      this.showError('Selecione ao menos um usuário para adicionar ao projeto');
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

    const tarefaToDelete = this.tarefas.find(t => t.id === tarefaId);
    this.selectedTarefa = tarefaToDelete;
    this.showDeleteTarefaModal = true;
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
      responsavel: this.currentUserName,
      status: 'ABERTA',
      projeto: { id: 0 },
      horasEstimadas: 0,
      tempoRegistrado: 0,
      usuarioResponsavel: this.currentUserId ? { id: this.currentUserId } : undefined,
      valorPorHora: 0,
      custoRegistrado: 0
    };
    this.startDate = new Date();
    this.endDate = new Date();

    this.startDateError = '';
    this.endDateError = '';
  }

  closeModal(): void {
    this.showNewTarefaModal = false;
    this.startDateError = '';
    this.endDateError = '';
  }
}
