import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';

@Component({
  selector: 'app-admin-relatorios',
  templateUrl: './admin-relatorios.component.html',
  styleUrls: ['./admin-relatorios.component.scss']
})
export class AdminRelatoriosComponent implements OnInit {
  projetos: Projeto[] = [];
  totalProjetos: number = 0;
  horasEstimadas: number = 0;
  tempoRegistrado: number = 0;
  custoEstimado: number = 0;
  custoTrabalhado: number = 0;

  constructor(private projectsService: ProjectsService) {}


  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projectsService.getProjetos().subscribe(
      (projetos) => {
        this.projetos = projetos;

        this.totalProjetos = this.projetos.length;
        this.horasEstimadas = this.projetos.reduce((total, projeto) => total + (projeto.horasEstimadas ?? 0), 0);
        this.tempoRegistrado = this.projetos.reduce((total, projeto) => total + (projeto.tempoRegistrado ?? 0), 0);
        this.custoEstimado = this.projetos.reduce((total, projeto) => total + (projeto.custoEstimado ?? 0), 0);
        this.custoTrabalhado = this.projetos.reduce((total, projeto) => total + (projeto.custoTrabalhado ?? 0), 0);
      },
      (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EM_ANDAMENTO':
        return 'status-andamento';
      case 'PLANEJADO':
        return 'status-planejado';
      case 'CONCLUIDO':
        return 'status-concluido';
      case 'CANCELADO':
        return 'status-cancelado';
      default:
        return '';
    }
  }

  getPriorityClass(prioridade: string): string {
    switch (prioridade) {
      case 'ALTA':
        return 'prioridade-alta';
      case 'MEDIA':
        return 'prioridade-media';
      case 'BAIXA':
        return 'prioridade-baixa';
      default:
        return '';
    }
  }
}
