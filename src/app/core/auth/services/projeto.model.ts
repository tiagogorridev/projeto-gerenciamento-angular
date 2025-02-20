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
  usuarioResponsavel: {
    id: number;
    nome: string;
    email: string;
    senha: string;
    dataCriacao: string;
    ultimoLogin: string | null;
    perfil: string;
  };
  cliente: {
    id: number;
    nome: string;
    email: string;
    status: string;
  };
}
