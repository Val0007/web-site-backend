import mongoose from 'mongoose';
import { UserSchema } from 'src/schemas/User.schema';

export const userProvider = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: typeof mongoose) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
