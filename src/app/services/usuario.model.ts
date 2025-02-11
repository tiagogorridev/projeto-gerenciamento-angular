// usuario.model.ts
export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil?: string;
  confirmPassword?: string;
}