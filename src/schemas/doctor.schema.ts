import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop()
  id: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  refreshToken: string;

  @Prop()
  mobileNumber: string;
}

export const DoctorShema = SchemaFactory.createForClass(Doctor);
