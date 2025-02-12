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

  ngOnInit(): void {}

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

      const usuarioResponsavel = { id: 1 };

      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: usuarioResponsavel
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
