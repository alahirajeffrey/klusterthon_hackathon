import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { Medication, MedicationShema } from 'src/schemas/medication.schema';
import {
  Patient_Doctor,
  Patient_DoctorShema,
} from 'src/schemas/patient_doctor.schema';
import { Doctor, DoctorShema } from 'src/schemas/doctor.schema';
import { Patient, PatientShema } from 'src/schemas/patient.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Reminder, ReminderShema } from 'src/schemas/reminder.schema';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService],
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientShema },
      { name: Doctor.name, schema: DoctorShema },
      { name: Patient_Doctor.name, schema: Patient_DoctorShema },
      { name: Medication.name, schema: MedicationShema },
      { name: Reminder.name, schema: ReminderShema },
    ]),
    JwtModule.register({}),
  ],
})
export class MedicationModule {}
