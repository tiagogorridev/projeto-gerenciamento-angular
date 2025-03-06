import { Usuario } from './../../../core/auth/services/usuario.model';

export interface Tarefa {
  id?: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA';
  projeto: { id: number; nome: string };
  usuarioResponsavel: { id: number; nome: string };
  horasEstimadas: number;
  horasDisponiveis?: number;
  tempoRegistrado?: number;
  valorPorHora: number;
  custoRegistrado: number;
  usuariosAssociados: Usuario[]; // Aqui definimos que usuariosAssociados é um array de objetos do tipo Usuario
}
