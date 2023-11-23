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
import { ChangeMedicationDto } from './dto/update-medication.dto';

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

  /**
   * change a patient's medication
   * @param medicationId : id of medication
   * @param doctorId : id of doctor
   * @param dto : update medication dto
   * @returns : 201 and new medication object
   */
  async changePatientMedication(
    medicationId: string,
    doctorId: string,
    dto: ChangeMedicationDto,
  ) {
    try {
      const medication = await this.medicationModel.findById(medicationId);
      if (!medication) {
        throw new HttpException(
          'Medication does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const doctor = await this.doctorModel.findById(doctorId);
      if (!doctor) {
        throw new HttpException(
          'Only doctors can change a patient medication',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // set old medication to changed
      await this.medicationModel.updateOne(
        { id: medicationId },
        {
          isMedicationChanged: true,
        },
      );

      const newMedication = await this.medicationModel.create({
        patientId: medication.patientId,
        doctorId: doctorId,
        medicationName: dto.medicationName,
        diagnosis: dto.diagnosis,
        timesToBeTakeb: dto.timesToBeTaken,
        dosage: dto.dosage,
        durationInHours: dto.durationInHours,
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: { newMedication },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get a patients history
   * @param patientId : id of patient
   * @returns 200 and list of medications
   */
  async getPatientHistory(patientId: string) {
    try {
      // get all medications and sort by latest
      const history = await this.medicationModel
        .find({ patientId: patientId })
        .sort({ createdAt: -1 });

      if (history.length === 0) {
        throw new HttpException(
          'Patient history not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: { history },
      };
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
}
