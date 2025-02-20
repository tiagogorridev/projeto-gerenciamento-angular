import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/auth/services/projects.service';
import { Projeto } from '../../../core/auth/services/projeto.model';

@Component({
  selector: 'app-projetos-usuario',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent implements OnInit {

  projetos: Projeto[] = [];

  constructor(private projetoService: ProjectsService) { }

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
      this.projetoService.getProjetosAssociados(+usuarioId).subscribe(projetos => {
        console.log(projetos);
        this.projetos = projetos;
      });
    }
  }
}
