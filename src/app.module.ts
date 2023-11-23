import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './common/config/config';
import { MedicationModule } from './medication/medication.module';
import { PatientModule } from './patient/patient.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderModule } from './reminder/reminder.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(config.MONGO_URI),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          dirname: 'logs',
          filename: 'logs.log',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}: ${message}]`;
        }),
      ),
    }),
    MedicationModule,
    PatientModule,
    ReminderModule,
  ],
})
export class AppModule {}
