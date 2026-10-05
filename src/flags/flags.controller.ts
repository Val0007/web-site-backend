import { Controller, Get } from '@nestjs/common';
import { FlagsService } from './flags.service';

@Controller('flags')
export class FlagsController {
  constructor(private flagsService: FlagsService) {}

  @Get()
  getFlags() {
    return this.flagsService.getFlags();
  }
}
