import mongoose from 'mongoose';
import { FlagsSchema } from '../schemas/Flags.schema';

export const flagsProvider = [
  {
    provide: 'FLAGS_MODEL',
    useFactory: (connection: typeof mongoose) =>
      connection.model('Flags', FlagsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
