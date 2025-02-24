import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-tarefa',
  templateUrl: './admin-tarefa.component.html',
  styleUrls: ['./admin-tarefa.component.scss']
})
export class AdminTarefaComponent implements OnInit {
  idprojeto: number = 0;
  idtarefa: number = 0;  // Altere para idtarefa em vez de id

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Captura os parâmetros da rota
    this.idprojeto = +this.route.snapshot.paramMap.get('idprojeto')!;
    this.idtarefa = +this.route.snapshot.paramMap.get('idtarefa')!;  // Atualize para 'idtarefa'
  }
}
