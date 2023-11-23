import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type Patient_DoctorDocument = HydratedDocument<Patient_Doctor>;

@Schema({ timestamps: true })
export class Patient_Doctor {
  @Prop()
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' } })
  patient: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' } })
  doctor: string;
}

export const Patient_DoctorShema = SchemaFactory.createForClass(Patient_Doctor);
