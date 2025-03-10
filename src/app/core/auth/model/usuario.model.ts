export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  ativo: 'ATIVO' | 'INATIVO';
  dataCriacao?: string;
  ultimoLogin?: string;
  confirmPassword?: string;
}
