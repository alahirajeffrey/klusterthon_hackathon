import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientShema } from 'src/schemas/patient.schema';
import { Doctor, DoctorShema } from 'src/schemas/doctor.schema';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from 'src/utils/util.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientShema },
      { name: Doctor.name, schema: DoctorShema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UtilService, EmailNotificationService],
})
export class AuthModule {}
