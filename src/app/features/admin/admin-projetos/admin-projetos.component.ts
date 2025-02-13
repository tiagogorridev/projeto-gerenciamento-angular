import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-projetos',
  templateUrl: './admin-projetos.component.html',
  styleUrls: ['./admin-projetos.component.scss']
})
export class AdminProjetosComponent implements OnInit {
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
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0');
    if (usuarioId) {
      this.projectsService.getProjetosDoUsuario(usuarioId).subscribe({
        next: (projetos) => {
          this.projects = projetos.map(projeto => {
            return {
              ...projeto,
              horasTrabalhadas: projeto.horasTrabalhadas || 0,
              custoTrabalhado: projeto.custoTrabalhado || 0
            };
          });
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

  navegarParaEdicao(projetoNome: string): void {
    this.router.navigate(['/admin/edit-projects', projetoNome]);
  }

  onSubmit(projectForm: any): void {
    if (projectForm.valid) {
      console.log('Dados do projeto antes de enviar para o backend:', this.project);

      this.project.dataInicio = this.startDate || null;
      this.project.dataFim = this.endDate || null;

      const usuarioId = parseInt(localStorage.getItem('usuario_id') || '0');

      const projetoParaEnviar = {
        nome: this.project.nome,
        descricao: this.project.descricao,
        horasEstimadas: this.project.horasEstimadas,
        custoEstimado: this.project.custoEstimado,
        status: this.project.status,
        prioridade: this.project.prioridade,
        dataInicio: this.project.dataInicio,
        dataFim: this.project.dataFim,
        usuarioResponsavel: { id: usuarioId }
      };

      this.projectsService.createProjeto(projetoParaEnviar).subscribe({
        next: (resposta) => {
          console.log('Projeto criado com sucesso:', resposta);
          this.closeModal();
          this.hasProjects = true;
          this.projects.push(resposta);

          this.projects = this.projects.map(projeto => ({
            ...projeto,
            custoEstimado: projeto.custoEstimado || 0,
            custoTrabalhado: projeto.custoTrabalhado || 0
          }));
        },
        error: (erro) => {
          console.error('Erro ao criar projeto:', erro);
        }
      });
    }
  }}
