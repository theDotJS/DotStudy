import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { SENHA_TAMANHO_MAXIMO } from '../politica.js';
import { normalizarEmail } from './normalizar-email.js';

// Entrada de POST /auth/login. Contrato: docs/contrato-api.md.
// Aqui nao se valida tamanho minimo nem formato: quem errar cai no 401 generico,
// e a resposta nao diz se o erro foi no e-mail ou na senha.
export class EntrarDto {
  @Transform(normalizarEmail)
  @IsString({ message: 'Informe o e-mail.' })
  @MaxLength(254)
  email: string;

  @IsString({ message: 'Informe a senha.' })
  @MaxLength(SENHA_TAMANHO_MAXIMO)
  senha: string;
}
