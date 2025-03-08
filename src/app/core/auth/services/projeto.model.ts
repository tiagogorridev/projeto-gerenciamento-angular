import { Tarefa } from './tarefa.model';

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  horasEstimadas: number;
  custoEstimado: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  prioridade: string;
  tempoRegistrado?: number;
  horasTrabalhadas?: number;
  custoTrabalhado?: number;
  custoRegistrado?: number;
  membrosAssociados?: Membro[];
  usuarioResponsavel: {
    id: number;
    nome: string;
    email: string;
    dataCriacao: string;
    perfil: string;
  };
  cliente: {
    id: number;
    nome: string;
    email: string;
    status: string;
  };
  dataCriacao: string;
  tarefas?: Tarefa[];
}

export interface Membro {
  id: number;
  nome: string;
  email: string;
}
