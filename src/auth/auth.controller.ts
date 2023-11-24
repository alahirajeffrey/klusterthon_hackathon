import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-patient.dto';
import { JwtGuard } from './guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('auth-endpoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register-patient')
  @ApiOperation({ summary: 'Register a new patient' })
  registerPatient(@Body() dto: RegisterUserDto) {
    return this.authService.registerPatient(dto);
  }

  @Post('register-doctor')
  @ApiOperation({ summary: 'Register a new doctor' })
  registerdoctor(@Body() dto: RegisterUserDto) {
    return this.authService.registerDoctor(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log a user in' })
  loginUser(@Body() dto: RegisterUserDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('change-password/:userId')
  @ApiOperation({ summary: 'Change user password' })
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Param('userId') userId: string,
  ) {
    return this.authService.changePassword(dto, userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Request email verification otp' })
  @Post('request-verification-email/:userId')
  requestEmailVerification(@Param('userId') userId: string) {
    return this.authService.requestEmailVerification(userId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch('verify-email/:userId')
  @ApiOperation({ summary: 'Verify email' })
  verifyEmail(@Body() dto: VerifyEmailDto, @Param('userId') userId: string) {
    return this.authService.verifyEmail(userId, dto);
  }
}
