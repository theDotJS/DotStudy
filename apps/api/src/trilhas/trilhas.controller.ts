import { Controller, Get, Param } from '@nestjs/common';
import { TrilhasService } from './trilhas.service.js';

// Contrato: GET /tracks e GET /tracks/:id/levels. Rotas publicas.
// O caminho fica em ingles porque e o que o contrato publicou e o front ja consome.
@Controller('tracks')
export class TrilhasController {
  constructor(private readonly trilhas: TrilhasService) {}

  @Get()
  listar() {
    return this.trilhas.listar();
  }

  @Get(':id/levels')
  listarNiveis(@Param('id') id: string) {
    return this.trilhas.listarNiveis(id);
  }
}
