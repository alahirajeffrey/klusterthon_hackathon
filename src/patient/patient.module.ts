import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientShema } from 'src/schemas/patient.schema';
import { Doctor, DoctorShema } from 'src/schemas/doctor.schema';
import { JwtModule } from '@nestjs/jwt';
import {
  Patient_Doctor,
  Patient_DoctorShema,
} from 'src/schemas/patient_doctor.schema';
import { UtilService } from 'src/utils/util.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, UtilService],
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientShema },
      { name: Doctor.name, schema: DoctorShema },
      { name: Patient_Doctor.name, schema: Patient_DoctorShema },
    ]),
    JwtModule.register({}),
  ],
})
export class PatientModule {}
