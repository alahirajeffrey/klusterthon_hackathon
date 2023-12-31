import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChangeMedicationDto } from './dto/update-medication.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateReminderDto } from './dto/create-reminder.dto';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('medication-endpoints')
@Controller('medication')
export class MedicationController {
  constructor(private medicationService: MedicationService) {}

  @Get(':medicationId')
  @ApiOperation({ summary: 'Get a single patient medication by id' })
  getMedicationDetailsById(@Param('medicationId') medicationId: string) {
    return this.medicationService.getMedicationDetailsById(medicationId);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get all a patient current medications' })
  getAllCurrentMedications(
    @Request() req,
    // @Param('patientId') patientId: string
  ) {
    return this.medicationService.getAllCurrentMedications(req.user.sub);
  }

  @Patch(':medicationId')
  @ApiOperation({ summary: 'Change a patient medication' })
  changePatientMedication(
    @Param('medicationId') medicationId: string,
    // @Param('doctorId') doctorId: string,
    @Body() dto: ChangeMedicationDto,
    @Request() req,
  ) {
    return this.medicationService.changePatientMedication(
      medicationId,
      req.user.sub,
      dto,
    );
  }

  @Get('patient')
  @ApiOperation({ summary: 'Get patient history' })
  getPatientHistory(
    @Request() req,
    // @Param('patientId') patientId: string
  ) {
    return this.medicationService.getPatientHistory(req.user.sub);
  }

  @Patch('complete/:medicationId')
  @ApiOperation({ summary: 'Complete a medication' })
  completeMedication(
    @Param('medicationId') medicationId: string,
    // @Param('patientId') patientId: string,
    @Request() req,
  ) {
    return this.medicationService.completeMedication(req.sub.id, medicationId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create medication' })
  createMedication(@Body() dto: CreateMedicationDto) {
    return this.medicationService.createMedication(dto);
  }

  @Patch('reminder/complete/:reminderId')
  @ApiOperation({ summary: 'Mark reminder as taken' })
  markReminderAsTaken(@Param('reminderId') reminderId: string) {
    return this.medicationService.markReminderAsTaken(reminderId);
  }

  @Post('reminder')
  @ApiOperation({ summary: 'Create reminder for a medication ' })
  addReminder(@Body() dto: CreateReminderDto) {
    return this.medicationService.addReminder(dto);
  }

  @Get('reminder/:medicationId')
  @ApiOperation({ summary: 'Get reminders for a medication' })
  getRemindersForMedication(@Param('medicationId') medicationId: string) {
    return this.medicationService.getRemindersForMedication(medicationId);
  }

  @Patch('reminder/:reminderId')
  @ApiOperation({ summary: 'Update time of a reminder' })
  updateReminder(
    @Param('reminderId') reminderId: string,
    @Body() dto: CreateReminderDto,
  ) {
    return this.medicationService.updateReminder(reminderId, dto);
  }

  @Delete('reminder/:reminderId')
  @ApiOperation({ summary: 'Delete  a reminder' })
  deleteReminder(@Param('reminderId') reminderId: string) {
    return this.medicationService.deleteReminder(reminderId);
  }

  @Get('reminder/details/:reminderId')
  @ApiOperation({ summary: 'Get reminder details by id' })
  getRminderDetailsById(@Param('reminderId') reminderId: string) {
    return this.medicationService.getRminderDetailsById(reminderId);
  }
}
