import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const mongoUri = configService.get<string>('MONGO_URI') || '';
      return mongoose.connect(mongoUri, {
        dbName: configService.get<string>('DB_NAME'),
      });
    },
  },
];
