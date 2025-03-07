
export interface LancamentoHoras {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  horas: number;
  descricao: string;
  status: 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';
  projeto: {
    id: number;
    nome: string;
  };
  tarefa: {
    id: number;
    nome: string;
  };
  usuario: {
    id: number;
    nome: string;
  };
}
