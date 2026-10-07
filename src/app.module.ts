import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { ConfigModule } from '@nestjs/config';
import { SiteModule } from './site/site.module';
import { AuthModule } from './auth/auth.module';
import { FlagsModule } from './flags/flags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    SiteModule,
    AuthModule,
    FlagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
