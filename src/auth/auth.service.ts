import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
//import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    //private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; userId: number }> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException('Email already used');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });
    console.log('user created', user);
    return { message: 'User created', userId: user.id };
  }

  async login(
    dto: LoginDto,
    res: Response,
  ): Promise<{ user: Omit<User, 'password'>, token: string }> {
    console.log('dans le login service', dto);
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    console.log('passwordValid', passwordValid);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    // Cookie sécurisé pour le web
    /*res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    });*/

    //Pour l'application mobile on renvoie le token dans le response.data
    const { password, ...safeUser } = user;
    console.log('on retire le password avant envoi', password);
    return {
      user: safeUser,
      token: accessToken,
    };
  }

  logout(res: Response) {
    // pour le web suppression des cookie
    /*res.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });*/

    //pour l'application mobile
    return { status: 'success', message: 'Déconnecter avec succès' };
  }
}
