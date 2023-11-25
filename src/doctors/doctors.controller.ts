import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorService: DoctorsService) {}

  @Get(':doctorId')
  @ApiOperation({ summary: 'Get a doctor by id' })
  getDoctorDetailsById(@Param('doctorId') doctorId: string) {
    return this.doctorService.getDoctorDetailsById(doctorId);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all doctors' })
  getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @Get('patients/:doctorId')
  @ApiOperation({ summary: 'Get all a doctor patients' })
  getDoctorPatients(@Param('doctorId') doctorId: string) {
    return this.doctorService.getDoctorPatients(doctorId);
  }

  @Patch(':doctorId')
  @ApiOperation({ summary: 'Update a doctor details' })
  updateDoctorDetails(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctorDetails(doctorId, dto);
  }
}
