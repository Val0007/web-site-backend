import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'flags' })
export class Flags {
  @Prop({ type: Boolean, default: false })
  template2: boolean;
}

export type FlagsDocument = Flags & Document;
export const FlagsSchema = SchemaFactory.createForClass(Flags);
