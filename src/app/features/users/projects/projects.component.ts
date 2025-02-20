import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service'; // Caminho do seu serviço
import { Projeto } from '../../../core/auth/services/projeto.model'; // Modelo de Projeto, ajuste conforme sua estrutura

@Component({
  selector: 'app-projetos-usuario',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent implements OnInit {

  projetos: Projeto[] = []; // Declarando a propriedade projetos

  constructor(private projetoService: ProjectsService) { }

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id'); // ou use um serviço de autenticação
    if (usuarioId) {
      this.projetoService.getProjetosAssociados(+usuarioId).subscribe(projetos => {
        console.log(projetos);
        this.projetos = projetos;
      });
    }
  }
}
