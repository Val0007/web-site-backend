import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { FlagsDocument } from '../schemas/Flags.schema';

export type FlagValues = { template2: boolean };

const DEFAULT_FLAGS: FlagValues = { template2: false };

@Injectable()
export class FlagsService implements OnModuleInit {
  constructor(
    @Inject('FLAGS_MODEL') private flagsModel: Model<FlagsDocument>,
  ) {}

  // Make sure the flags document exists, so the collection is visible in Mongo
  // and can be toggled by hand. Existing values are never overwritten.
  async onModuleInit() {
    await this.flagsModel.updateOne(
      {},
      { $setOnInsert: DEFAULT_FLAGS },
      { upsert: true },
    );
  }

  async getFlags(): Promise<FlagValues> {
    const flags = await this.flagsModel.findOne().lean();
    return { template2: flags?.template2 ?? DEFAULT_FLAGS.template2 };
  }
}
