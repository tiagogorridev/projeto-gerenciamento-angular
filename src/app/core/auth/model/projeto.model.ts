import { Usuario } from './usuario.model';
import { Tarefa } from './tarefa.model';

export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  horasEstimadas: number;
  custoEstimado: number;
  dataInicio: string;
  dataFim: string;
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  tempoRegistrado?: number;
  custoRegistrado?: number;
  membrosAssociados?: Usuario[];
  usuarioResponsavel: {
    id: number;
    nome: string;
  };
  cliente: {
    id: number;
    nome: string;
    email: string;
    status: string;
  };
  dataCriacao: string;
  tarefas?: Tarefa[];
  horasTrabalhadas?: number;
  custoTrabalhado?: number;
}
