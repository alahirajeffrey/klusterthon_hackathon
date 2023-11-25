import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { UtilService } from 'src/utils/util.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientShema } from 'src/schemas/patient.schema';
import { Doctor, DoctorShema } from 'src/schemas/doctor.schema';
import {
  Patient_Doctor,
  Patient_DoctorShema,
} from 'src/schemas/patient_doctor.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [DoctorsService, UtilService],
  controllers: [DoctorsController],
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientShema },
      { name: Doctor.name, schema: DoctorShema },
      { name: Patient_Doctor.name, schema: Patient_DoctorShema },
    ]),
    JwtModule.register({}),
  ],
})
export class DoctorsModule {}
