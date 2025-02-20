export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  usuarioResponsavel: {
    id: number;
    nome: string;
  };
  horasEstimadas: number;
  custoEstimado: number;
  dataCriacao: string;
  prioridade: string;
  cliente: {
    id: number;
    nome: string;
  };
  membros: {
    id: number;
    nome: string;
    email: string;
  }[];
}
