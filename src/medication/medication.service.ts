import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Doctor } from 'src/schemas/doctor.schema';
import { Medication } from 'src/schemas/medication.schema';
import { Patient } from 'src/schemas/patient.schema';
import { Patient_Doctor } from 'src/schemas/patient_doctor.schema';
import { Reminder } from 'src/schemas/reminder.schema';

@Injectable()
export class MedicationService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient_Doctor.name)
    private patientDoctorModel: Model<Patient_Doctor>,
    @InjectModel(Medication.name)
    private medicationModel: Model<Medication>,
    @InjectModel(Reminder.name)
    private reminderModel: Model<Reminder>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {}

  /**
   * get details of a medication by id
   * @param medicationId : id of medication
   * @returns : 200 and medication object
   */
  async getMedicationDetailsById(medicationId: string) {
    try {
      const medication = await this.medicationModel.findById(medicationId);
      if (!medication) {
        throw new HttpException(
          'Medication does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: { medication },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPatientMedication() {
    try {
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMedication() {
    try {
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePatientMedication() {
    try {
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
