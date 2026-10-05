import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FlagsController } from './flags.controller';
import { flagsProvider } from './flags.providers';
import { FlagsService } from './flags.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FlagsController],
  providers: [FlagsService, ...flagsProvider],
  exports: [FlagsService],
})
export class FlagsModule {}
