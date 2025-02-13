import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  hasProjects: boolean = false;
  showNewProjectModal: boolean = false;

  projects: any[] = [];

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
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0'); // Recupera o ID do usuário logado
    if (usuarioId) {
        this.projectsService.getProjetosDoUsuario(usuarioId).subscribe({
            next: (projetos) => {
                this.projects = projetos;
                this.hasProjects = this.projects.length > 0;
            },
            error: (erro) => {
                console.error('Erro ao carregar os projetos:', erro);
            }
        });
    }
}

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  closeModal(): void {
    this.showNewProjectModal = false;
  }

  onSubmit(projectForm: any): void {
    if (projectForm.valid) {
      this.project.dataInicio = this.startDate || null;
      this.project.dataFim = this.endDate || null;

      // Recupera o ID do usuário logado
      const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0'); // Supondo que o ID do usuário esteja armazenado no localStorage

      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: { id: usuarioId }  // Passando o ID do usuário logado
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          console.log('Projeto criado com sucesso:', resposta);
          this.closeModal();
          this.hasProjects = true;
          this.projects.push(resposta);
        },
        error: (erro) => {
          console.error('Erro ao criar projeto:', erro);
        }
      });
    }
  }
}
