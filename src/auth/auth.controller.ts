import {
  Controller,
  Get,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './utils/GoogleAuthGuard';
import { AuthService } from './auth.services';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) throw new HttpException('Error logging in', 400);
    const token = await this.authService.signIn({
      email: (req.user as { email: string }).email,
    });
    //REDIRECT TO FRONTEND
    // return {token}
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const frontendUrl = this.configService.get<string>('ADMIN_URL');
    const redirectUrl = `${frontendUrl}?token=${token}`;

    res.redirect(redirectUrl);
  }

  @Get('status')
  user(@Req() request: Request) {
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
