import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from './patient.schema';
import { Medication } from './medication.schema';

export type ReminderDocument = HydratedDocument<Reminder>;

@Schema({ timestamps: true })
export class Reminder {
  @Prop()
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patientId: Patient;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }] })
  medicationId: Medication[];

  @Prop()
  time: Date;

  @Prop({ default: false })
  isTaken: boolean;
}

export const ReminderShema = SchemaFactory.createForClass(Reminder);
