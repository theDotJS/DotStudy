import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class RespostaDto {
  @IsString()
  @MaxLength(64)
  questaoId: string;

  // O rotulo da alternativa: "a", "b", "c", "d". E o `id` que GET /levels/:id devolve.
  @IsString()
  @MaxLength(8)
  alternativaId: string;
}

// Entrada de POST /levels/:id/submit. Contrato: docs/contrato-api.md.
export class SubmeterDto {
  @IsArray()
  // Teto generoso: um nivel tem 5 questoes. Impede corpo gigante de proposito.
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => RespostaDto)
  respostas: RespostaDto[];
}
