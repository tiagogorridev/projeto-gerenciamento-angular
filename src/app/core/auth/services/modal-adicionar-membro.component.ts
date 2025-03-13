import { Component } from '@angular/core';
import { AssociarUsuarioService } from './associar-usuario.service';
import { environment } from './../../../../../environments/environment.prod';

@Component({
  selector: 'app-modal-adicionar-membro',
  templateUrl: './modal-adicionar-membro.component.html',
  styleUrls: ['./modal-adicionar-membro.component.css']
})
export class ModalAdicionarMembroComponent {
  idUsuario: number = 0;
  idProjeto: number = 0;

  constructor(private associarUsuarioService: AssociarUsuarioService) {}

  adicionarMembro() {
    if (this.idUsuario && this.idProjeto) {
      this.associarUsuarioService.associarUsuarioAoProjeto(this.idUsuario, this.idProjeto).subscribe({
        next: (response) => {
          console.log('Usuário associado com sucesso!');
          alert(response);
        },
        error: (err) => {
          console.error('Erro ao associar usuário:', err);
          alert('Erro ao associar usuário');
        }
      });
    } else {
      alert('Selecione um usuário e um projeto válidos!');
    }
  }
}
