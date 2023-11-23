import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from './patient.schema';
import { Doctor } from './doctor.schema';

export type MediactionDocument = HydratedDocument<Medication>;

@Schema({ timestamps: true })
export class Medication {
  @Prop()
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patientId: Patient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctorId: Doctor;

  @Prop()
  medicationName: string;

  @Prop()
  diagnosis: string;

  @Prop()
  timesToBeTakeb: number;

  @Prop()
  dosage: number;

  @Prop()
  durationInHours: number;

  @Prop({ default: false })
  isCompleted: boolean;
}

export const MedicationShema = SchemaFactory.createForClass(Medication);
