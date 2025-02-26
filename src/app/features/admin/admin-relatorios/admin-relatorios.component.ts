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

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projectsService.getProjetos().subscribe(
      (projetos) => {
        this.projetos = projetos;
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
