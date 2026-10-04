// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class TabData {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  link?: string;
}

@Schema()
class Content {
  structureId: number;
  data: TabData[];
}

@Schema()
export class User {
  @Prop({ required: false }) //mongoose level
  name: string; //ts-level

  @Prop({ required: true, unique: true })
  wildcard: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  templateId: number;

  @Prop({ required: false })
  skills: string[];

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  color: string; //site appearance

  @Prop({
    type: {
      linkedin: { type: String },
      github: { type: String },
      mail: { type: String },
    },
    default: {},
  })
  links?: {
    linkedin?: string;
    github?: string;
    mail?: string;
  };

  @Prop({
    type: [String],
    required: false,
    // validate: [(val: string[]) => val.length > 0, 'Tabs array cannot be empty'],
  })
  tabs: string[];

  @Prop({
    type: Content,
    required: false,
  })
  content?: { [key: string]: Content };
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
