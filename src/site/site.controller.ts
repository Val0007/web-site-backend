import { Controller, Get, Param } from '@nestjs/common';
import { SiteService } from './site.services';

@Controller('site')
export class SiteController {
  constructor(private SiteService: SiteService) {}

  @Get(':wildcard')
  getUser(@Param('wildcard') wildcard: string) {
    console.log(wildcard);
    return this.SiteService.getSite(wildcard);
  }
}
