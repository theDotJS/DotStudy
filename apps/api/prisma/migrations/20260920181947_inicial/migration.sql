-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trilhas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trilhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveis" (
    "id" TEXT NOT NULL,
    "trilhaId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,

    CONSTRAINT "niveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fontes" (
    "id" TEXT NOT NULL,
    "nivelId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "fontes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questoes" (
    "id" TEXT NOT NULL,
    "nivelId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,

    CONSTRAINT "questoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternativas" (
    "id" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "rotulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "alternativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tentativas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nivelId" TEXT NOT NULL,
    "acertos" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percentual" INTEGER NOT NULL,
    "aprovado" BOOLEAN NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tentativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conclusoes_nivel" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nivelId" TEXT NOT NULL,
    "melhorPercentual" INTEGER NOT NULL,
    "concluidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conclusoes_nivel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "niveis_trilhaId_ordem_key" ON "niveis"("trilhaId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "questoes_nivelId_ordem_key" ON "questoes"("nivelId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "alternativas_questaoId_rotulo_key" ON "alternativas"("questaoId", "rotulo");

-- CreateIndex
CREATE INDEX "tentativas_usuarioId_nivelId_idx" ON "tentativas"("usuarioId", "nivelId");

-- CreateIndex
CREATE UNIQUE INDEX "conclusoes_nivel_usuarioId_nivelId_key" ON "conclusoes_nivel"("usuarioId", "nivelId");

-- AddForeignKey
ALTER TABLE "niveis" ADD CONSTRAINT "niveis_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "trilhas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fontes" ADD CONSTRAINT "fontes_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "niveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "niveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativas" ADD CONSTRAINT "alternativas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentativas" ADD CONSTRAINT "tentativas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentativas" ADD CONSTRAINT "tentativas_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "niveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conclusoes_nivel" ADD CONSTRAINT "conclusoes_nivel_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conclusoes_nivel" ADD CONSTRAINT "conclusoes_nivel_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "niveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
