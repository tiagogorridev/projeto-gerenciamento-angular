import { Component } from '@angular/core';

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
      // Verificar se as datas não são nulas antes de atribuir
      this.project.dataInicio = this.startDate || null;
      this.project.dataFim = this.endDate || null;

      // Enviar o projeto (chamada de API ou lógica de negócio)
      console.log('Projeto criado:', this.project);
      this.closeModal(); // Fechar o modal após o envio
    }
  }
}
