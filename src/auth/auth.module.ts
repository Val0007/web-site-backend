import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.services';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { UserModule } from 'src/User/user.module';
import { JwtStrategy } from './utils/JwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserModule,JwtModule.register({secret:"secret"}),PassportModule.register({ defaultStrategy: 'jwt', session: false }),],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AuthService,
    JwtStrategy
    // SessionSerializer,
    // {
    //   provide: 'AUTH_SERVICE',
    //   useClass: AuthService,
    // },
  ],
})
export class AuthModule {}