import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';
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

  // Track loaded project data
  projetosComTempoRegistrado: { [key: number]: number } = {};
  projetosComCustoRegistrado: { [key: number]: number } = {};
  isLoading: boolean = true;

  statusOptions = ['EM ANDAMENTO', 'CANCELADO', 'CONCLUIDO', 'PLANEJADO'];
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
        this.projetos = projetos;

        // Create an array of observables for all project data with proper mapping
        const tempoRequests = projetos.map(projeto =>
          this.projetoService.getTempoRegistradoProjeto(projeto.id).pipe(
            map(response => {
              // Check if response is an object and extract the value
              if (response !== null && typeof response === 'object') {
                // Log the response to see its structure
                console.log('Tempo registrado response:', response);

                // Depending on the response structure, extract the value
                // Common patterns might be response.value, response.horasRegistradas, etc.
                // This is a guess - adjust based on actual response structure
                if ('horasRegistradas' in response) {
                  return response.horasRegistradas;
                } else if ('valor' in response) {
                  return response.valor;
                } else if ('horas' in response) {
                  return response.horas;
                } else {
                  // If we can't identify a specific property, convert to string and use a numeric value
                  const numValue = parseFloat(response.toString());
                  return isNaN(numValue) ? 0 : numValue;
                }
              }
              return typeof response === 'number' ? response : 0;
            }),
            catchError(error => {
              console.error(`Erro ao buscar tempo registrado para projeto ${projeto.id}:`, error);
              return of(0); // Return 0 if there's an error
            })
          )
        );

        // Execute all requests in parallel
        forkJoin(tempoRequests).subscribe(
          tempos => {
            // Store tempo registrado for each project
            projetos.forEach((projeto, index) => {
              this.projetosComTempoRegistrado[projeto.id] = tempos[index];

              // For this example, we'll use custoTrabalhado directly from the project
              this.projetosComCustoRegistrado[projeto.id] = projeto.custoTrabalhado || 0;
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

  getProgresso(projeto: Projeto): string {
    const tempoRegistrado = this.projetosComTempoRegistrado[projeto.id];
    // Ensure we have a valid number, not an object
    const tempoValue = typeof tempoRegistrado === 'number' ? tempoRegistrado : 0;
    return `${tempoValue}h de ${projeto.horasEstimadas}h`;
  }

  getCusto(projeto: Projeto): string {
    const custoRegistrado = this.projetosComCustoRegistrado[projeto.id] || 0;
    return `R$${custoRegistrado.toFixed(2)} de R$${projeto.custoEstimado.toFixed(2)}`;
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
