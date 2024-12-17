import { AuthGuard } from 'src/auth/auth.guard';
import { IdToken } from 'src/auth/id-token.decorator';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UsersService } from './users.service';
import { EmailVerifiedGuard } from 'src/auth/email-verified.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    return await this.usersService.registerUser(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard,EmailVerifiedGuard)
  @ApiBearerAuth()
  async profile(@IdToken() token: string) {
    return await this.firebaseService.verifyIdToken(token);
  }

  @Post('password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    await this.firebaseService.sendPasswordResetEmail(email);
    return {
      message: 'E-mail de redefinição de senha enviado com sucesso.',
    };
  }
}
