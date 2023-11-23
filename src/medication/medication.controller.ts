import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { MedicationService } from './medication.service';
// import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangeMedicationDto } from './dto/update-medication.dto';

// @UseGuards(JwtGuard)
// @ApiSecurity('JWT-auth')
@ApiTags('medication-endpoints')
@Controller('medication')
export class MedicationController {
  constructor(private medicationService: MedicationService) {}

  @Get(':medicationId')
  @ApiOperation({ summary: 'Get a patient medication by id' })
  getPatientById(@Param('medicationId') medicationId: string) {
    return this.medicationService.getMedicationDetailsById(medicationId);
  }

  @Patch(':medicationId/:doctorId')
  @ApiOperation({ summary: 'Change a patient medication' })
  changePatientMedication(
    @Param('medicationId') medicationId: string,
    @Param('doctorId') doctorId: string,
    @Body() dto: ChangeMedicationDto,
  ) {
    return this.medicationService.changePatientMedication(
      medicationId,
      doctorId,
      dto,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient history' })
  getPatientHistory(@Param('patientId') patientId: string) {
    return this.medicationService.getPatientHistory(patientId);
  }

  @Patch('complete/:medicationId/:patientId')
  @ApiOperation({ summary: 'Complete a medication' })
  completeMedication(
    @Param('medicationId') medicationId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.medicationService.completeMedication(patientId, medicationId);
  }
}
