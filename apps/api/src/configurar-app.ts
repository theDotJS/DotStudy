import { INestApplication } from '@nestjs/common';
import { FiltroDeErros } from './comum/filtro-de-erros.js';
import { criarPipeDeValidacao } from './comum/validacao.js';

// Configuracao compartilhada entre o main.ts e os testes e2e.
// Se ficasse so no main.ts, o teste rodaria uma API diferente da real.
export function configurarApp(app: INestApplication): void {
  // Somente o endereco do frontend pode chamar a API.
  // origin: '*' fica de fora. Tarefa S4 de Seguranca.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(criarPipeDeValidacao());

  // Formato unico de erro (contrato, secao 2) para toda rota.
  app.useGlobalFilters(new FiltroDeErros());
}
