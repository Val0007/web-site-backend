import { Model } from 'mongoose';
import { Injectable, Inject, HttpException } from '@nestjs/common';
import { UserDocument } from 'src/schemas/User.schema';

@Injectable()
export class SiteService {
  constructor(@Inject('USER_MODEL') private userModel: Model<UserDocument>) {}

  async getSite(wildcard: string) {
    const user = await this.userModel.findOne({ wildcard });
    if (!user) throw new HttpException('Site not Found', 400);
    return user;
  }
}
