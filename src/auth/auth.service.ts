import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/patient.schema';
import { Logger } from 'winston';
import { RegisterUserDto } from './dto/register-patient.dto';
import * as bcrypt from 'bcryptjs';
import { ApiResponse } from 'src/common/types/response.type';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { UtilService } from 'src/utils/util.service';
import { Otp } from 'src/schemas/otp.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
    private emailService: EmailNotificationService,
    private utilService: UtilService,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {}

  /**
   * register patient
   * @param dto : email and password
   * @returns status code and patient object
   */
  async registerPatient(dto: RegisterUserDto): Promise<ApiResponse> {
    try {
      // check if user exists
      const patientEmailExists = await this.patientModel.findOne({
        email: dto.email,
      });
      if (patientEmailExists) {
        throw new HttpException(
          'Patient with email already exists',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // check if user exists
      const doctorEmailExists = await this.doctorModel.findOne({
        email: dto.email,
      });
      if (doctorEmailExists) {
        throw new HttpException(
          'Doctor with email already exists',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // hash  password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      // create patient
      const newPatient = await this.patientModel.create({
        email: dto.email,
        password: passwordHash,
      });

      // strip off passowod
      delete newPatient.password;

      return {
        statusCode: HttpStatus.CREATED,
        data: { newPatient },
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
   * register doctor
   * @param dto : email and password
   * @returns : status code and doctor object
   */
  async registerDoctor(dto: RegisterUserDto): Promise<ApiResponse> {
    try {
      // check if user exists
      const doctorEmailExists = await this.doctorModel.findOne({
        email: dto.email,
      });
      if (doctorEmailExists) {
        throw new HttpException(
          'Doctor with email already exists',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // check if user exists
      const patientEmailExists = await this.patientModel.findOne({
        email: dto.email,
      });
      if (patientEmailExists) {
        throw new HttpException(
          'Patient with email already exists',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // hash  password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      // create patient
      const newDoctor = await this.doctorModel.create({
        email: dto.email,
        password: passwordHash,
      });

      // strip off passowod
      delete newDoctor.password;

      return {
        statusCode: HttpStatus.CREATED,
        data: { newDoctor },
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
   * login doctor or patient
   * @param dto : email and password
   * @returns : id, access token and refresh token
   */
  async login(dto: RegisterUserDto): Promise<ApiResponse> {
    try {
      const patientExists = await this.patientModel.findOne({
        email: dto.email,
      });

      if (patientExists) {
        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(
          dto.password,
          patientExists.password,
        );
        if (!isPasswordCorrect) {
          throw new HttpException(
            'Incorrect password',
            HttpStatus.UNAUTHORIZED,
          );
        }
        const payload = { sub: patientExists._id, email: patientExists.email };

        // sign access token
        const accessToken = await this.jwtService.signAsync(payload, {
          expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
          secret: this.config.get('JWT_ACCESS_SECRET'),
        });

        // sign refresh token
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFFRESH_EXPIRES_IN'),
        });

        // save refresh token to db
        await this.patientModel.findByIdAndUpdate(
          {
            _id: patientExists._id,
          },
          {
            refreshToken: refreshToken,
          },
        );

        return {
          statusCode: HttpStatus.OK,
          data: {
            userId: patientExists._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      }

      // if patient does not exist, check if doctor exists
      const doctorExists = await this.doctorModel.findOne({ email: dto.email });

      if (!doctorExists) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // check if password is correct
      const isPasswordCorrect = await bcrypt.compare(
        dto.password,
        doctorExists.password,
      );
      if (!isPasswordCorrect) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }
      const payload = { sub: doctorExists._id, email: doctorExists.email };

      // sign access token
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });

      // sign refresh token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFFRESH_EXPIRES_IN'),
      });

      // save refresh token to db
      await this.doctorModel.findByIdAndUpdate(
        {
          _id: doctorExists._id,
        },
        {
          refreshToken: refreshToken,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        data: {
          userId: doctorExists._id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
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
   * change password
   * @param dto : change password dto
   * @param userId : id of user
   * @returns : status code and message
   */
  async changePassword(dto: ChangePasswordDto, userId: string) {
    try {
      const patientExists = await this.patientModel.findOne({
        _id: userId,
      });

      if (patientExists) {
        // check if old password is correct
        const isPasswordCorrect = await bcrypt.compare(
          dto.oldPassword,
          patientExists.password,
        );
        if (!isPasswordCorrect) {
          throw new HttpException(
            'Incorrect password',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.patientModel.findByIdAndUpdate(
          {
            _id: userId,
          },
          {
            password: newPasswordHash,
          },
        );

        return {
          statusCode: HttpStatus.OK,
          message: { message: 'Password changed successfully' },
        };
      }

      const doctorExists = await this.doctorModel.findOne({
        _id: userId,
      });

      if (!doctorExists) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // check if old password is correct
      const isPasswordCorrect = await bcrypt.compare(
        dto.oldPassword,
        doctorExists.password,
      );
      if (!isPasswordCorrect) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }
      const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
      await this.doctorModel.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          password: newPasswordHash,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Password changed successfully' },
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
   * send email verification otp to user
   * @param userId : id of user
   * @returns : 200 and message
   */
  async requestEmailVerification(userId: string) {
    try {
      // check if patient eixts
      const patient = await this.patientModel.findById(userId);

      // if patient does not eixts, check if doctor exists and send otp
      if (!patient) {
        const doctor = await this.doctorModel.findById(userId);
        if (doctor) {
          const otp = this.utilService.generateOtp();

          // check if there is an existing otp and delete
          await this.otpModel.deleteOne({ doctorId: doctor._id });

          await this.emailService.sendEmailVerificationOtp(doctor.email, otp);

          await this.otpModel.create({
            otp: otp,
            doctorId: userId,
          });

          return {
            statusCode: HttpStatus.OK,
            data: { message: 'Email verification otp sent' },
          };
        }

        // return not found error if doctor does not exist
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // verify email if patient exist and send otp
      const otp = this.utilService.generateOtp();

      // check if there is an existing otp and delete
      await this.otpModel.deleteOne({ doctorId: patient._id });

      await this.emailService.sendEmailVerificationOtp(patient.email, otp);

      await this.otpModel.create({
        otp: otp,
        patientId: userId,
      });

      return {
        statusCode: HttpStatus.OK,
        data: { message: 'Email verification otp sent' },
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
   * verify email
   * @param userId : if of user
   * @param dto : email verification dto
   * @returns 200 and message
   */
  async verifyEmail(userId: string, dto: VerifyEmailDto) {
    try {
      // check if patient exist
      const patient = await this.patientModel.findById(userId);

      // if patient does not exist, check if doctor exist and verify
      if (!patient) {
        const doctor = await this.doctorModel.findById(userId);
        if (doctor) {
          const userOtp = await this.otpModel.findOne({ doctorId: userId });

          if (userOtp.otp !== dto.otp) {
            throw new HttpException('Incorrect otp', HttpStatus.UNAUTHORIZED);
          }

          await this.doctorModel.updateOne(
            { _id: userId },
            { isEmailVerified: true },
          );

          await this.otpModel.deleteOne({ _id: userOtp._id });

          return {
            statusCode: HttpStatus.OK,
            message: { message: 'Email successfully verified' },
          };
        }

        // return error if patient and doctor do not exist
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // verify email if patient exist
      const userOtp = await this.otpModel.findOne({ patientId: userId });

      if (userOtp.otp !== dto.otp) {
        throw new HttpException('Incorrect otp', HttpStatus.UNAUTHORIZED);
      }

      await this.patientModel.updateOne(
        { _id: userId },
        { isEmailVerified: true },
      );

      await this.otpModel.deleteOne({ _id: userOtp._id });

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Email successfully verified' },
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
