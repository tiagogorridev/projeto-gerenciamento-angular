import { Component, OnInit } from '@angular/core';  // Certifique-se de que está assim
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-tarefa',
  templateUrl: './admin-tarefa.component.html',
  styleUrls: ['./admin-tarefa.component.scss']
})
export class AdminTarefaComponent implements OnInit {
  idprojeto: number = 0;
  id: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idprojeto = +this.route.snapshot.paramMap.get('idprojeto')!;
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }
}
