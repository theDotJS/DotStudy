import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  // Prova que o servidor sobe e responde. Nao toca no banco de proposito:
  // se esta rota falhar, o problema e o servidor, nao o Postgres.
  // Contrato: docs/contrato-api.md, secao 3.
  @Get()
  verificar(): { status: string } {
    return { status: 'ok' };
  }
}
