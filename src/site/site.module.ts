import { Module } from '@nestjs/common';
import { UserModule } from 'src/User/user.module';
import { SiteController } from './site.controller';
import { SiteService } from './site.services';

@Module({
  imports: [UserModule],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
