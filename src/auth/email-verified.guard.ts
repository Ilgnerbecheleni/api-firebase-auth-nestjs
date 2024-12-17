import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtém o token do cabeçalho de autorização
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    // Verifica o token usando FirebaseService
    const decodedToken = await this.firebaseService.verifyIdToken(token);

    // Verifica se o e-mail está verificado
    if (!decodedToken.email_verified) {
      throw new UnauthorizedException('E-mail não verificado. Verifique seu e-mail para acessar esta rota.');
    }

    // Anexa o usuário verificado ao objeto request
    request.user = decodedToken;

    return true; // Permite o acesso
  }
}
