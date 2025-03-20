import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/model/projeto.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  projetosComTempoRegistrado: { [key: number]: number } = {};
  projetosComCustoRegistrado: { [key: number]: number } = {};
  isLoading: boolean = true;

  statusOptions = ['EM_ANDAMENTO', 'CANCELADO', 'CONCLUIDO', 'PLANEJADO'];
  prioridadeOptions = ['ALTA', 'MEDIA', 'BAIXA'];

  constructor(
    private projetoService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
      this.isLoading = true;
      this.projetoService.getProjetosAssociados(+usuarioId).subscribe(projetos => {
        console.log('Projetos recebidos da API:', projetos);

        this.projetos = projetos;

        const tempoRequests = projetos.map(projeto =>
          this.projetoService.getTempoRegistradoProjeto(projeto.id || 0).pipe(
            map(response => {
              console.log('Resposta do tempo registrado:', response);
              if (response !== null && typeof response === 'object') {
                return response.tempoRegistrado || 0;
              }
              return typeof response === 'number' ? response : 0;
            }),
            catchError(error => {
              console.error(`Erro ao buscar tempo registrado para projeto ${projeto.id}:`, error);
              return of(0);
            })
          )
        );

        forkJoin(tempoRequests).subscribe(
          tempos => {
            console.log('Tempos registrados:', tempos);
            projetos.forEach((projeto, index) => {
              this.projetosComTempoRegistrado[projeto.id || 0] = tempos[index];
              this.projetosComCustoRegistrado[projeto.id || 0] = projeto.custoRegistrado || 0;
            });

            this.filteredProjetos = projetos;
            this.applyFilters();
            this.isLoading = false;
          },
          error => {
            console.error('Erro ao buscar dados dos projetos:', error);
            this.isLoading = false;
          }
        );
      });
    }
  }

  formatTime(totalHoras: number): string {
    const horas = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horas) * 60);

    if (minutos > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${horas}h`;
    }
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }

  getSelectStatus(displayStatus: string): string {
    return displayStatus.replace(' ', '_');
  }

  getProgresso(projeto: Projeto): string {
    const tempoRegistrado = this.projetosComTempoRegistrado[projeto.id || 0] || 0;
    return `${this.formatTime(tempoRegistrado)} / ${this.formatTime(projeto.horasEstimadas)}`;
  }

  getCusto(projeto: Projeto): string {
    const custoRegistrado = this.projetosComCustoRegistrado[projeto.id || 0] || 0;
    return `R$${custoRegistrado.toFixed(2)} / R$${projeto.custoEstimado.toFixed(2)}`;
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
