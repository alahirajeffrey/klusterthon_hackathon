import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('patient-endpoints')
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get('')
  @ApiOperation({ summary: 'Get a patient by id' })
  getPatientById(
    @Request() req,
    // @Param('patientId') patientId: string
  ) {
    return this.patientService.getPatientById(req.user.sub);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all patients' })
  getAllPatients() {
    return this.patientService.getAllPatients();
  }

  @Get('doctor')
  @ApiOperation({ summary: 'Get a patient current doctor' })
  getPatientsDoctor(
    @Request() req,
    // @Param('patientId') patientId: string
  ) {
    return this.patientService.getPatientsDoctor(req.user.sub);
  }

  @Patch('')
  @ApiOperation({ summary: 'Update a patient details' })
  updatePatientDetials(
    // @Param('patientId') patientId: string,
    @Body() dto: UpdateUserDto,
    @Request() req,
  ) {
    return this.patientService.updatePatientDetials(req.user.id, dto);
  }
}
