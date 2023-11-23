import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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

  @Get(':patientId')
  @ApiOperation({ summary: 'Get a patient by id' })
  getPatientById(@Param('patientId') patientId: string) {
    return this.patientService.getPatientById(patientId);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all patients' })
  getAllPatients() {
    return this.patientService.getAllPatients();
  }

  @Get('doctor/:patientId')
  @ApiOperation({ summary: 'Get a patient currnt doctor' })
  getPatientsDoctor(@Param('patientId') patientId: string) {
    return this.patientService.getPatientsDoctor(patientId);
  }

  @Patch(':patientId')
  @ApiOperation({ summary: 'Update a patient details' })
  updatePatientDetials(
    @Param('patientId') patientId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.patientService.updatePatientDetials(patientId, dto);
  }
}
