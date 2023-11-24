import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiResponse } from 'src/common/types/response.type';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/patient.schema';
import { Patient_Doctor } from 'src/schemas/patient_doctor.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UtilService } from 'src/utils/util.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient_Doctor.name)
    private patientDoctorModel: Model<Patient_Doctor>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private utilService: UtilService,
  ) {}

  /**
   * get a patient's details by id
   * @param patientId : id of patient
   * @returns : 200 and patient object
   */
  async getPatientById(patientId: string): Promise<ApiResponse> {
    try {
      const patient = await this.patientModel.findOne({ id: patientId });

      if (!patient) {
        throw new HttpException('Patient does not exist', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: { patient },
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
   * get all patients
   * @returns : 200 and list of patients
   */
  async getAllPatients(): Promise<ApiResponse> {
    try {
      const patients = await this.patientModel.find();
      return {
        statusCode: HttpStatus.OK,
        data: { patients },
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
   * get a patient's current doctor
   * @param patientId : id of patient
   * @returns : 200 and current doctor object
   */
  async getPatientsDoctor(patientId: string) {
    try {
      const patientsDoctors = await this.patientDoctorModel
        .find({
          id: patientId,
        })
        .sort({ createdAt: -1 });

      // get curent doctor id
      const currentDoctor = patientsDoctors[0];

      if (currentDoctor === undefined) {
        throw new HttpException(
          'Patient has not been assigned a doctor',
          HttpStatus.NOT_FOUND,
        );
      }

      const doctor = await this.doctorModel.findById(currentDoctor);

      return {
        statusCode: HttpStatus.OK,
        data: { doctor },
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
   * update a patient's details
   * @param patientId : id of patient
   * @param dto : update user dto
   * @returns : 200 and message
   */
  async updatePatientDetials(patientId: string, dto: UpdateUserDto) {
    try {
      const patient = await this.patientModel.findById(patientId);
      if (!patient) {
        throw new HttpException('Patient does not exist', HttpStatus.NOT_FOUND);
      }

      await this.patientModel.updateOne(
        {
          id: patientId,
        },
        {
          firstName: dto.firstName,
          lastName: dto.lastName,
          mobileNumber: this.utilService.parseMobileNumber(dto.mobileNumber),
        },
      );

      return {
        statusCode: HttpStatus.OK,
        data: { message: 'Patient records updated' },
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
