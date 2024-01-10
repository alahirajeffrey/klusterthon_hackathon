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
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ApiResponse } from 'src/common/types/response.type';

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
  async getMedicationDetailsById(medicationId: string): Promise<ApiResponse> {
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
   * get all a patient's current medicaton
   * @param patientId : id of patient
   * @returns 200 and list of medication objects
   */
  async getAllCurrentMedications(patientId: string) {
    try {
      const currentMedications = await this.medicationModel.find({
        _id: patientId,
        isCompleted: false,
      });

      return {
        statusCode: HttpStatus.OK,
        data: { currentMedications },
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
  ): Promise<ApiResponse> {
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
        { _id: medicationId },
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
  async getPatientHistory(patientId: string): Promise<ApiResponse> {
    try {
      // get all medications and sort by latest
      const history = await this.medicationModel
        .find({ patientId: patientId })
        .sort({ createdAt: -1 });

      // console.log(history);
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

  /**
   * complete medication
   * @param patientId : id of patient
   * @param medicationId : id of medication
   * @returns : 200 and response message
   */
  async completeMedication(
    patientId: string,
    medicationId: string,
  ): Promise<ApiResponse> {
    try {
      const patient = await this.patientModel.findById(patientId);
      if (!patient) {
        throw new HttpException('Patient does not exist', HttpStatus.NOT_FOUND);
      }

      const medication = await this.medicationModel.findById(medicationId);
      if (!medication) {
        throw new HttpException(
          'Medication does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (medication.isCompleted === true) {
        throw new HttpException(
          'Medication has already been completed',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (String(medication.patientId) !== String(patient._id)) {
        throw new HttpException(
          'You cannot mark a medication that is not yours as complete',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.medicationModel.updateOne(
        { _id: medicationId },
        { isCompleted: true },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Medication completed',
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
   * create medication
   * @param dto : create medication dto
   * @returns : 201 and medication details
   */
  async createMedication(dto: CreateMedicationDto): Promise<ApiResponse> {
    try {
      const isDoctor = await this.doctorModel.findById(dto.doctorId);
      if (!isDoctor) {
        throw new HttpException(
          'Only a doctor can put a patient on medication',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const newMedication = await this.medicationModel.create({
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        medicationName: dto.medicationName,
        diagnosis: dto.diagnosis,
        timesToBeTaken: dto.timesToBeTaken,
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
   * craete reminder
   * @param dto : create reminder dto
   * @returns : 201 and reminder object
   */
  async addReminder(dto: CreateReminderDto): Promise<ApiResponse> {
    try {
      const medication = await this.medicationModel.findById(dto.medicationId);
      if (!medication) {
        throw new HttpException(
          'Medication does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const patient = await this.patientModel.findById(dto.patientId);
      if (!patient) {
        throw new HttpException('Patient does not exist', HttpStatus.NOT_FOUND);
      }

      const reminder = await this.reminderModel.create({
        patientId: medication.patientId,
        medicationId: dto.medicationId,
        patientMobileNumber: patient.mobileNumber,
        time: dto.time,
        medicationName: medication.medicationName,
        dosage: medication.dosage,
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: { reminder },
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
   * mark drug and reminder as taken
   * @param reminderId : id of the reminder
   * @returns : 200 and message
   */
  async markReminderAsTaken(reminderId: string): Promise<ApiResponse> {
    try {
      const reminder = await this.reminderModel.findById(reminderId);
      if (!reminder) {
        throw new HttpException(
          'Reminder does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.reminderModel.updateOne(
        { _id: reminderId },
        { isTaken: true },
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Drug taken',
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
   * get all reminders for a medication
   * @param medicationId : id of medication
   * @returns : 200 and list of reminders
   */
  async getRemindersForMedication(medicationId: string): Promise<ApiResponse> {
    try {
      const reminders = await this.reminderModel.find({
        medicationId: medicationId,
      });
      if (!reminders) {
        throw new HttpException(
          'Medication does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: { reminders },
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
   * update the time of a reminder
   * @param reminderId : id of reminder
   * @param dto : create reminder dto
   * @returns : 200 and message
   */
  async updateReminder(
    reminderId: string,
    dto: CreateReminderDto,
  ): Promise<ApiResponse> {
    try {
      console.log(reminderId);
      const reminder = await this.reminderModel.findById(reminderId);
      if (!reminder) {
        throw new HttpException(
          'Reminder does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.reminderModel.updateOne(
        { _id: reminderId },
        { time: dto.time },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Reminder updated',
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
   * delete a reminder
   * @param reminderId : id of reminder
   * @returns 200 and message
   */
  async deleteReminder(reminderId: string): Promise<ApiResponse> {
    try {
      const reminder = await this.reminderModel.findById(reminderId);
      if (!reminder) {
        throw new HttpException(
          'Reminder does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.reminderModel.deleteOne({ _id: reminderId });

      return {
        statusCode: HttpStatus.OK,
        message: 'Reminder deleted',
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
   * get details of a reminder
   * @param reminderId : id of reminder
   * @returns : 200 and reminder object
   */
  async getRminderDetailsById(reminderId: string): Promise<ApiResponse> {
    try {
      const reminder = await this.reminderModel.findOne({ _id: reminderId });
      if (!reminder) {
        throw new HttpException(
          'Reminder does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: { reminder },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
