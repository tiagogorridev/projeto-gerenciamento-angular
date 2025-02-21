import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';

@Component({
  selector: 'app-projetos-usuario',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projetos: Projeto[] = [];
  filteredProjetos: Projeto[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';
  selectedCliente: string = '';

  statusOptions = ['EM ANDAMENTO', 'CANCELADO', 'CONCLUIDO', 'PLANEJADO'];
  prioridadeOptions = ['ALTA', 'MEDIA', 'BAIXA'];

  constructor(
    private projetoService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
      this.projetoService.getProjetosAssociados(+usuarioId).subscribe(projetos => {
        this.projetos = projetos;
        this.filteredProjetos = projetos;
        this.applyFilters();
      });
    }
  }

  getProgresso(projeto: Projeto): string {
    const horasTrabalhadas = projeto.horasTrabalhadas || 0;
    return `${horasTrabalhadas}h de ${projeto.horasEstimadas}h`;
  }

  getCusto(projeto: Projeto): string {
    const custoTrabalhado = projeto.custoTrabalhado || 0;
    return `R$${custoTrabalhado.toFixed(2)} de R$${projeto.custoEstimado.toFixed(2)}`;
  }

  applyFilters(): void {
    this.filteredProjetos = this.projetos.filter(projeto => {
      const matchesSearch = projeto.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          projeto.cliente.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || projeto.status === this.selectedStatus;
      const matchesPrioridade = !this.selectedPrioridade || projeto.prioridade === this.selectedPrioridade;
      const matchesCliente = !this.selectedCliente || projeto.cliente.nome === this.selectedCliente;

      return matchesSearch && matchesStatus && matchesPrioridade && matchesCliente;
    });
  }

  navegarParaProjeto(projetoId: number, projetoNome: string): void {
    this.router.navigate(['/user/about-projects', projetoId], {
      state: { projectName: projetoNome }
    });
  }
}
