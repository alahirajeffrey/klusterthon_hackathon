import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient {
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

  @Prop()
  dateOfBirth: Date;
}

export const PatientShema = SchemaFactory.createForClass(Patient);
