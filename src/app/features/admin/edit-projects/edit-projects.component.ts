import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.scss']
})
export class EditProjectsComponent {
  projetoNome: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projetoNome = this.route.snapshot.paramMap.get('nome');
    console.log('Nome do projeto:', this.projetoNome);
  }
}
