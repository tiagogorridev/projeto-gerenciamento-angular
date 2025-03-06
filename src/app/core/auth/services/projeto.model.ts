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

export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  usuariosAssociados?: Usuario[];  // Definição da propriedade usuariosAssociados
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: 'ADMIN' | 'USUARIO';
  confirmPassword?: string;
  ativo: 'ATIVO';
  id_projeto?: number;
  id_usuario?: number;
}
