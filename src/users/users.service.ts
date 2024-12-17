import { FirebaseService } from 'src/firebase/firebase.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerUser(dto: RegisterUserDto) {
     // 1. Cria o usuário no Firebase
     const user = await this.firebaseService.createUser({
      displayName: dto.firstName,
      email: dto.email,
      password: dto.password,
    });

    if (!user) {
      throw new BadRequestException('Falha ao registrar o usuário.');
    }

    // 2. Faz login para obter o ID Token
    const { idToken } = await this.firebaseService.signInWithEmailAndPassword(
      dto.email,
      dto.password,
    );

    // 3. Envia o e-mail de verificação
    await this.firebaseService.sendEmailVerification(idToken);

    return {
      message: 'Usuário registrado com sucesso. Verifique seu e-mail.',
      userId: user.uid,
    };
  }
}
