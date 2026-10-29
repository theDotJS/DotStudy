import type { TransformFnParams } from 'class-transformer';

// " Maria@Exemplo.com " vira "maria@exemplo.com". Usado no cadastro e no login,
// para os dois compararem o mesmo texto.
export function normalizarEmail({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}
