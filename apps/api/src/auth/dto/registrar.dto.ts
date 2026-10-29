import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SENHA_TAMANHO_MAXIMO, SENHA_TAMANHO_MINIMO } from '../politica.js';
import { normalizarEmail } from './normalizar-email.js';

// Entrada de POST /auth/register. Contrato: docs/contrato-api.md.
export class RegistrarDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Informe o nome.' })
  @Length(1, 80, { message: 'O nome precisa ter entre 1 e 80 caracteres.' })
  nome: string;

  // RN-13: e-mail unico. Normalizar antes evita "Maria@x.com" e "maria@x.com" virarem duas contas.
  @Transform(normalizarEmail)
  @IsEmail(
    {},
    { message: 'E-mail inválido.', context: { codigo: 'EMAIL_INVALIDO' } },
  )
  @MaxLength(254, {
    message: 'E-mail longo demais.',
    context: { codigo: 'EMAIL_INVALIDO' },
  })
  email: string;

  @IsString({ message: 'Informe a senha.', context: { codigo: 'SENHA_FRACA' } })
  @MinLength(SENHA_TAMANHO_MINIMO, {
    message: `A senha precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`,
    context: { codigo: 'SENHA_FRACA' },
  })
  @MaxLength(SENHA_TAMANHO_MAXIMO, {
    message: `A senha pode ter no máximo ${SENHA_TAMANHO_MAXIMO} caracteres.`,
  })
  senha: string;
}
