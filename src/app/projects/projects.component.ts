import { Component } from '@angular/core';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  hasProjects: boolean = false;
  showNewProjectModal: boolean = false;

  project = {
    nome: '',
    descricao: '',
    cliente: '',
    horasEstimadas: 0,
    custoEstimado: 0,
    dataInicio: null as Date | null,  // Aceitar tanto Date quanto null
    dataFim: null as Date | null,    // Aceitar tanto Date quanto null
    status: 'PLANEJADO',
    prioridade: 'ALTA'
  };

  startDate: Date | null = new Date();  // Data de início
  endDate: Date | null = new Date();    // Data de fim

  constructor(private projectsService: ProjectsService) {}

  onlyNumbers(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
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

      const usuarioResponsavel = { id: 1 };  // Substitua pelo usuário logado dinamicamente

      const projetoParaEnviar = {
        ...this.project,
        usuarioResponsavel: usuarioResponsavel
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          console.log('Projeto criado com sucesso:', resposta);
          this.closeModal();  // Fechar o modal após o envio
        },
        error: (erro) => {
          console.error('Erro ao criar projeto:', erro);
        }
      });
    }
  }
}
