export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  status: string;
  totalProjetos?: number;
  dataCadastro?: string;
  dataAtualizacao?: string;
}
