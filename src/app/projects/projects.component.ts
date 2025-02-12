import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  clientes: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4'];
  filteredClientes: string[] = this.clientes;
  showClientList: boolean = false;
  selectedClient: string = ''; // Cliente selecionado

  // Método para alternar a visibilidade da lista de clientes
  toggleClientList() {
    this.showClientList = !this.showClientList;
  }

  // Método de filtro de clientes
  filterClients(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredClientes = this.clientes.filter(cliente => cliente.toLowerCase().includes(searchTerm));
  }

  // Método de seleção de cliente
  selectClient(cliente: string) {
    this.selectedClient = cliente;  // Define o cliente selecionado
    this.showClientList = false;    // Fecha a lista de clientes
  }

  // Evento global que fecha a lista quando o clique for fora do campo ou da lista
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clientSelect = document.getElementById('cliente-select');
    const inputField = document.getElementById('cliente-search');

    // Verifica se o clique foi fora do campo de pesquisa ou da lista de clientes
    if (clientSelect && inputField && !clientSelect.contains(event.target as Node) && !inputField.contains(event.target as Node)) {
      this.showClientList = false;
    }
  }
}
