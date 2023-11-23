import { Controller, Get, Param } from '@nestjs/common';
import { MedicationService } from './medication.service';
// import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// @UseGuards(JwtGuard)
// @ApiSecurity('JWT-auth')
@ApiTags('medication-endpoints')
@Controller('medication')
export class MedicationController {
  constructor(private medicationService: MedicationService) {}

  @Get(':medicationId')
  @ApiOperation({ summary: 'Get a patient by id' })
  getPatientById(@Param('medicationId') medicationId: string) {
    return this.medicationService.getMedicationDetailsById(medicationId);
  }
}
