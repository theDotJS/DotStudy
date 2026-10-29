import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { EXPIRACAO_PADRAO } from './politica.js';

// Global: qualquer modulo usa o AuthGuard sem importar este modulo.
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const segredo = config.get<string>('JWT_SEGREDO');
        // Sem segredo, a API nao sobe. Melhor travar aqui do que assinar token com valor vazio.
        if (!segredo || segredo.length < 32) {
          throw new Error(
            'JWT_SEGREDO ausente ou curto (minimo 32 caracteres). Veja o .env.example e o README.',
          );
        }
        return {
          secret: segredo,
          signOptions: {
            expiresIn: (config.get<string>('JWT_EXPIRACAO') ??
              EXPIRACAO_PADRAO) as never,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
