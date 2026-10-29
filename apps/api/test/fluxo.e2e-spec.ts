import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configurarApp } from '../src/configurar-app.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Teste ponta a ponta do MVP: cadastro, login, mapa, nivel, submissao e progresso.
// Cada `it` cita a regra de docs/regras-de-negocio.md ou o trecho do contrato que prova.
//
// Roda contra o banco do seu .env (o Postgres local). Ele cria uma trilha e usuarios
// proprios, com e-mail @e2e.dotstudy.test, e apaga tudo no final. Os seus dados nao mudam.
//
//   npm run db:up            (na raiz)
//   npm run test:e2e         (em apps/api)

const DOMINIO = '@e2e.dotstudy.test';
const sufixo = randomUUID().slice(0, 8);

describe('Fluxo do MVP (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let trilhaId: string;
  let niveis: { id: string; ordem: number; questoes: string[] }[];
  let tokenA: string;
  let tokenB: string;

  const api = () => request(app.getHttpServer());
  const comoA = (r: request.Test) => r.set('Authorization', `Bearer ${tokenA}`);

  // Monta as respostas do nivel acertando as `acertos` primeiras. A correta e sempre "a".
  const respostas = (nivel: (typeof niveis)[number], acertos: number) =>
    nivel.questoes.map((questaoId, i) => ({
      questaoId,
      alternativaId: i < acertos ? 'a' : 'b',
    }));

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulo.createNestApplication();
    configurarApp(app);
    await app.init();
    prisma = app.get(PrismaService);

    // Trilha de teste: 3 niveis, 5 questoes cada, alternativa "a" sempre correta.
    const trilha = await prisma.trilha.create({
      data: {
        titulo: `Trilha e2e ${sufixo}`,
        descricao: 'Criada e apagada pelo teste e2e.',
        niveis: {
          create: [1, 2, 3].map((ordem) => ({
            ordem,
            titulo: `Nivel ${ordem}`,
            objetivo: `Objetivo ${ordem}`,
            conteudo: `Conteudo ${ordem}`,
            fontes: {
              create: [{ titulo: 'Fonte', url: 'https://pt.wikipedia.org' }],
            },
            questoes: {
              create: [1, 2, 3, 4, 5].map((q) => ({
                ordem: q,
                enunciado: `Pergunta ${q}`,
                alternativas: {
                  create: [
                    { rotulo: 'a', texto: 'Certa', correta: true },
                    { rotulo: 'b', texto: 'Errada', correta: false },
                    { rotulo: 'c', texto: 'Errada', correta: false },
                  ],
                },
              })),
            },
          })),
        },
      },
      include: {
        niveis: {
          orderBy: { ordem: 'asc' },
          include: { questoes: { orderBy: { ordem: 'asc' } } },
        },
      },
    });
    trilhaId = trilha.id;
    niveis = trilha.niveis.map((n) => ({
      id: n.id,
      ordem: n.ordem,
      questoes: n.questoes.map((q) => q.id),
    }));
  });

  afterAll(async () => {
    // onDelete: Cascade no schema leva junto niveis, questoes, tentativas e conclusoes.
    await prisma.usuario.deleteMany({
      where: { email: { endsWith: DOMINIO } },
    });
    await prisma.trilha.deleteMany({ where: { id: trilhaId } });
    await app.close();
  });

  describe('saude e formato de erro', () => {
    it('GET /health responde ok', async () => {
      await api().get('/health').expect(200, { status: 'ok' });
    });

    it('rota inexistente devolve o formato unico de erro', async () => {
      const r = await api().get('/nao-existe').expect(404);
      expect(r.body.erro.codigo).toBe('NAO_ENCONTRADO');
    });

    it('JSON malformado devolve 400 no formato unico, sem stack trace', async () => {
      const r = await api()
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": ')
        .expect(400);
      expect(r.body.erro.codigo).toBe('REQUISICAO_MALFORMADA');
      expect(JSON.stringify(r.body)).not.toMatch(/at .*\.js/);
    });
  });

  describe('autenticacao', () => {
    it('cadastra e devolve token (e-mail normalizado)', async () => {
      const r = await api()
        .post('/auth/register')
        .send({
          nome: 'Ana',
          email: ` Ana.${sufixo}${DOMINIO.toUpperCase()} `,
          senha: 'senhaboa123',
        })
        .expect(201);
      expect(r.body.token).toEqual(expect.any(String));
      expect(r.body.usuario.email).toBe(`ana.${sufixo}${DOMINIO}`);
      expect(r.body.usuario).not.toHaveProperty('senhaHash');
      tokenA = r.body.token;
    });

    it('RN-14: a senha fica guardada so como hash', async () => {
      const usuario = await prisma.usuario.findUnique({
        where: { email: `ana.${sufixo}${DOMINIO}` },
      });
      expect(usuario?.senhaHash).not.toBe('senhaboa123');
      expect(usuario?.senhaHash).toMatch(/^\$argon2id\$/);
    });

    it('RN-13: e-mail repetido devolve 409', async () => {
      const r = await api()
        .post('/auth/register')
        .send({
          nome: 'Ana 2',
          email: `ana.${sufixo}${DOMINIO}`,
          senha: 'outrasenha123',
        })
        .expect(409);
      expect(r.body.erro.codigo).toBe('EMAIL_JA_CADASTRADO');
    });

    it('senha curta devolve 422 SENHA_FRACA com o campo apontado', async () => {
      const r = await api()
        .post('/auth/register')
        .send({ nome: 'Bia', email: `bia.${sufixo}${DOMINIO}`, senha: '123' })
        .expect(422);
      expect(r.body.erro.codigo).toBe('SENHA_FRACA');
      expect(r.body.erro.campos.senha).toEqual(expect.any(String));
    });

    it('e-mail invalido devolve 422 EMAIL_INVALIDO', async () => {
      const r = await api()
        .post('/auth/register')
        .send({ nome: 'Bia', email: 'isso-nao-e-email', senha: 'senhaboa123' })
        .expect(422);
      expect(r.body.erro.codigo).toBe('EMAIL_INVALIDO');
    });

    it('campo que nao existe no contrato e recusado', async () => {
      await api()
        .post('/auth/register')
        .send({
          nome: 'Bia',
          email: `bia.${sufixo}${DOMINIO}`,
          senha: 'senhaboa123',
          admin: true,
        })
        .expect(422);
    });

    it('login com senha errada e com e-mail inexistente dao a MESMA resposta', async () => {
      const senhaErrada = await api()
        .post('/auth/login')
        .send({ email: `ana.${sufixo}${DOMINIO}`, senha: 'errada-errada' })
        .expect(401);
      const semConta = await api()
        .post('/auth/login')
        .send({ email: `ninguem.${sufixo}${DOMINIO}`, senha: 'errada-errada' })
        .expect(401);
      expect(senhaErrada.body).toEqual(semConta.body);
      expect(senhaErrada.body.erro.codigo).toBe('CREDENCIAIS_INVALIDAS');
    });

    it('login correto devolve 200 e token', async () => {
      const r = await api()
        .post('/auth/login')
        .send({ email: `ANA.${sufixo}${DOMINIO}`, senha: 'senhaboa123' })
        .expect(200);
      expect(r.body.token).toEqual(expect.any(String));
    });

    it('rota protegida sem token devolve 401', async () => {
      const r = await api().get('/me/progress').expect(401);
      expect(r.body.erro.codigo).toBe('NAO_AUTENTICADO');
    });

    it('rota protegida com token adulterado devolve 401', async () => {
      await api()
        .get('/me/progress')
        .set('Authorization', `Bearer ${tokenA}x`)
        .expect(401);
    });
  });

  describe('conteudo', () => {
    it('GET /tracks lista a trilha com o total de niveis', async () => {
      const r = await api().get('/tracks').expect(200);
      const trilha = r.body.trilhas.find(
        (t: { id: string }) => t.id === trilhaId,
      );
      expect(trilha).toMatchObject({ totalNiveis: 3 });
    });

    it('GET /tracks/:id/levels lista em ordem e sem conteudo', async () => {
      const r = await api().get(`/tracks/${trilhaId}/levels`).expect(200);
      expect(r.body.niveis.map((n: { ordem: number }) => n.ordem)).toEqual([
        1, 2, 3,
      ]);
      expect(r.body.niveis[0]).not.toHaveProperty('conteudo');
    });

    it('trilha inexistente devolve 404 TRILHA_NAO_ENCONTRADA', async () => {
      const r = await api().get('/tracks/nao-existe/levels').expect(404);
      expect(r.body.erro.codigo).toBe('TRILHA_NAO_ENCONTRADA');
    });

    it('RN-09: GET /levels/:id nao manda o gabarito para o navegador', async () => {
      const r = await comoA(api().get(`/levels/${niveis[0].id}`)).expect(200);
      expect(r.body.questoes).toHaveLength(5);
      expect(r.body.fontes).toHaveLength(1);
      expect(JSON.stringify(r.body)).not.toContain('correta');
    });

    it('nivel inexistente devolve 404 NIVEL_NAO_ENCONTRADO', async () => {
      const r = await comoA(api().get('/levels/nao-existe')).expect(404);
      expect(r.body.erro.codigo).toBe('NIVEL_NAO_ENCONTRADO');
    });
  });

  describe('progressao', () => {
    const progresso = async (token: string) => {
      const r = await api()
        .get(`/me/progress?trilhaId=${trilhaId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      return r.body.niveis as {
        estado: string;
        melhorPercentual: number | null;
      }[];
    };

    it('RN-01: usuario novo tem so o nivel 1 disponivel', async () => {
      expect((await progresso(tokenA)).map((n) => n.estado)).toEqual([
        'disponivel',
        'bloqueado',
        'bloqueado',
      ]);
    });

    it('RN-07: nivel bloqueado nao abre', async () => {
      const r = await comoA(api().get(`/levels/${niveis[1].id}`)).expect(403);
      expect(r.body.erro.codigo).toBe('NIVEL_BLOQUEADO');
    });

    it('RN-07: nivel bloqueado recusa submissao', async () => {
      const r = await comoA(api().post(`/levels/${niveis[1].id}/submit`))
        .send({ respostas: respostas(niveis[1], 5) })
        .expect(403);
      expect(r.body.erro.codigo).toBe('NIVEL_BLOQUEADO');
    });

    it('resposta faltando devolve 422 RESPOSTAS_INCOMPLETAS e nao grava tentativa', async () => {
      const antes = await prisma.tentativa.count({
        where: { nivelId: niveis[0].id },
      });
      const r = await comoA(api().post(`/levels/${niveis[0].id}/submit`))
        .send({ respostas: respostas(niveis[0], 5).slice(0, 3) })
        .expect(422);
      expect(r.body.erro.codigo).toBe('RESPOSTAS_INCOMPLETAS');
      expect(
        await prisma.tentativa.count({ where: { nivelId: niveis[0].id } }),
      ).toBe(antes);
    });

    it('questao de outro nivel devolve 422 RESPOSTAS_INVALIDAS', async () => {
      const misturadas = [
        ...respostas(niveis[0], 4),
        { questaoId: niveis[1].questoes[0], alternativaId: 'a' },
      ];
      const r = await comoA(api().post(`/levels/${niveis[0].id}/submit`))
        .send({ respostas: misturadas })
        .expect(422);
      expect(r.body.erro.codigo).toBe('RESPOSTAS_INVALIDAS');
    });

    it('RN-03 e RN-04: 3 de 5 reprova, grava a tentativa e nao bloqueia nada', async () => {
      const r = await comoA(api().post(`/levels/${niveis[0].id}/submit`))
        .send({ respostas: respostas(niveis[0], 3) })
        .expect(200);
      expect(r.body).toMatchObject({
        acertos: 3,
        total: 5,
        percentual: 60,
        notaDeCorte: 70,
        aprovado: false,
        proximoNivelLiberado: null,
      });
      expect(r.body.porQuestao).toHaveLength(5);
      expect((await progresso(tokenA))[0].estado).toBe('disponivel');
    });

    it('RN-11 e RN-12: 5 de 5 aprova, conclui o nivel e libera o proximo', async () => {
      const r = await comoA(api().post(`/levels/${niveis[0].id}/submit`))
        .send({ respostas: respostas(niveis[0], 5) })
        .expect(200);
      expect(r.body).toMatchObject({ percentual: 100, aprovado: true });
      expect(r.body.proximoNivelLiberado).toEqual({
        id: niveis[1].id,
        ordem: 2,
      });

      const estados = await progresso(tokenA);
      expect(estados.map((n) => n.estado)).toEqual([
        'concluido',
        'disponivel',
        'bloqueado',
      ]);
      expect(estados[0].melhorPercentual).toBe(100);
    });

    it('RN-05: refazer com nota menor nao diminui a pontuacao nem tira a conclusao', async () => {
      const r = await comoA(api().post(`/levels/${niveis[0].id}/submit`))
        .send({ respostas: respostas(niveis[0], 4) })
        .expect(200);
      expect(r.body).toMatchObject({
        percentual: 80,
        aprovado: true,
        proximoNivelLiberado: null,
      });

      const reprovado = await comoA(
        api().post(`/levels/${niveis[0].id}/submit`),
      )
        .send({ respostas: respostas(niveis[0], 0) })
        .expect(200);
      expect(reprovado.body.aprovado).toBe(false);

      const estados = await progresso(tokenA);
      expect(estados[0]).toMatchObject({
        estado: 'concluido',
        melhorPercentual: 100,
      });
    });

    it('RN-04: toda tentativa fica registrada', async () => {
      const usuario = await prisma.usuario.findUnique({
        where: { email: `ana.${sufixo}${DOMINIO}` },
      });
      const tentativas = await prisma.tentativa.count({
        where: { usuarioId: usuario!.id, nivelId: niveis[0].id },
      });
      expect(tentativas).toBe(4);
    });

    it('ultimo nivel aprovado devolve proximoNivelLiberado null', async () => {
      await comoA(api().post(`/levels/${niveis[1].id}/submit`))
        .send({ respostas: respostas(niveis[1], 5) })
        .expect(200);
      const r = await comoA(api().post(`/levels/${niveis[2].id}/submit`))
        .send({ respostas: respostas(niveis[2], 5) })
        .expect(200);
      expect(r.body).toMatchObject({
        aprovado: true,
        proximoNivelLiberado: null,
      });
      expect((await progresso(tokenA)).map((n) => n.estado)).toEqual([
        'concluido',
        'concluido',
        'concluido',
      ]);
    });

    it('RN-16: o progresso de A nao aparece para B', async () => {
      const r = await api()
        .post('/auth/register')
        .send({
          nome: 'Bruno',
          email: `bruno.${sufixo}${DOMINIO}`,
          senha: 'senhaboa123',
        })
        .expect(201);
      tokenB = r.body.token;

      expect((await progresso(tokenB)).map((n) => n.estado)).toEqual([
        'disponivel',
        'bloqueado',
        'bloqueado',
      ]);
      await api()
        .get(`/levels/${niveis[1].id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(403);
    });
  });
});
