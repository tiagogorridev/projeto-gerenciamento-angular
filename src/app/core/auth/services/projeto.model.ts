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
  horasTrabalhadas?: number; // Adicionado
  custoTrabalhado?: number; // Adicionado
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
  tarefas?: Tarefa[];  // Adicionei a propriedade tarefas
}

export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
}
