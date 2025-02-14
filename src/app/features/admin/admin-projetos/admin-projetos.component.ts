import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { ClienteService } from '../../../core/auth/services/clients.service'; // Import the ClienteService
import { Router } from '@angular/router';
import { Cliente } from '../../../core/auth/services/clients.service'; // Import the Cliente interface

@Component({
  selector: 'app-admin-projetos',
  templateUrl: './admin-projetos.component.html',
  styleUrls: ['./admin-projetos.component.scss']
})
export class AdminProjetosComponent implements OnInit {
  hasProjects: boolean = false;
  showNewProjectModal: boolean = false;
  projects: any[] = [];
  clientes: Cliente[] = []; // Add clientes property to hold the list of clients

  project = {
    nome: '',
    descricao: '',
    cliente: '',
    horasEstimadas: 0,
    custoEstimado: 0,
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
    status: 'PLANEJADO',
    prioridade: 'ALTA'
  };

  startDate: Date | null = new Date();
  endDate: Date | null = new Date();

  constructor(
    private projectsService: ProjectsService,
    private clienteService: ClienteService, // Inject ClienteService
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);
    if (usuarioId) {
      this.projectsService.getProjetosDoUsuario(usuarioId).subscribe({
        next: (projetos) => {
          this.projects = projetos.map(projeto => ({
            ...projeto,
            horasTrabalhadas: projeto.horasTrabalhadas || 0,
            custoTrabalhado: projeto.custoTrabalhado || 0
          }));
          this.hasProjects = this.projects.length > 0;
        },
        error: (erro) => {
          console.error('Erro ao carregar os projetos:', erro);
        }
      });
    }

    this.clienteService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes; // Populate clientes array with data
      },
      error: (erro) => {
        console.error('Erro ao carregar os clientes:', erro);
      }
    });
  }

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  closeModal(): void {
    this.showNewProjectModal = false;
  }

  navegarParaEdicao(projetoNome: string): void {
    this.router.navigate(['/admin/edit-projects', projetoNome]);
  }

  onSubmit(projectForm: any): void {
    if (projectForm.valid) {
      this.project.dataInicio = this.startDate;
      this.project.dataFim = this.endDate;

      const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0', 10);
      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: { id: usuarioId }
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          this.closeModal();
          this.projects.push(resposta);
          this.hasProjects = this.projects.length > 0;
        },
        error: (erro) => {
          console.error('Erro ao criar projeto:', erro);
        }
      });
    }
  }
}
