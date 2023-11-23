import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientShema } from 'src/schemas/patient.schema';
import { Doctor, DoctorShema } from 'src/schemas/doctor.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientShema },
      { name: Doctor.name, schema: DoctorShema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
