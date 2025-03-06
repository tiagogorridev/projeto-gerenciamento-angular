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
  dataCriacao?: string;
  ultimoLogin?: string;
}
