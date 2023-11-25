import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/patient.schema';
import { Patient_Doctor } from 'src/schemas/patient_doctor.schema';
import { UtilService } from 'src/utils/util.service';
import { Logger } from 'winston';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiResponse } from 'src/common/types/response.type';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient_Doctor.name)
    private patientDoctorModel: Model<Patient_Doctor>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private utilService: UtilService,
  ) {}

  /**
   * get a doctor by id
   * @param doctorId : id of doctor
   * @returns : 200 and doctor object
   */
  async getDoctorDetailsById(doctorId: string): Promise<ApiResponse> {
    try {
      const doctor = await this.doctorModel.findById(doctorId);
      if (!doctor) {
        throw new HttpException('Doctor does not exist', HttpStatus.NOT_FOUND);
      }

      return { statusCode: HttpStatus.OK, data: { doctor } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get all doctors
   * @returns : 200 and list of doctor objects
   */
  async getAllDoctors() {
    try {
      const doctors = await this.doctorModel.find();

      return { statusCode: HttpStatus.OK, data: { doctors } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get all patients being treated by a doctor
   * @param doctorId
   * @returns
   */
  async getDoctorPatients(doctorId: string) {
    try {
      const patientsIdList = await this.patientDoctorModel.find({
        doctorId: doctorId,
      });

      const patientObjectsList = [];

      for (let i = 0; i < patientsIdList.length; i++) {
        const patientObject = await this.patientModel.findById(
          patientsIdList[i],
        );
        if (patientObject.isCurrentlyBeingTreated === true) {
          patientObjectsList.push(patientObject);
        }
      }

      return {
        statusCode: HttpStatus.OK,
        data: { patientObjectsList },
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
   * update a doctor's details
   * @param doctorId : id of doctor
   * @param dto : update doctor's detials dto
   * @returns : 200 and message
   */
  async updateDoctorDetails(
    doctorId: string,
    dto: UpdateDoctorDto,
  ): Promise<ApiResponse> {
    try {
      const doctor = await this.doctorModel.findById(doctorId);
      if (!doctor) {
        throw new HttpException('Doctor does not exist', HttpStatus.NOT_FOUND);
      }

      await this.doctorModel.updateOne(
        { _id: doctorId },
        {
          firstName: dto.firstName,
          lastName: dto.lastName,
          mobileNumber: this.utilService.parseMobileNumber(dto.mobileNumber),
        },
      );
      return {
        statusCode: HttpStatus.OK,
        data: { message: 'Doctor records updated' },
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
