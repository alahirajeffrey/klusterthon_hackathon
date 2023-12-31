import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorService: DoctorsService) {}

  @Get('')
  @ApiOperation({ summary: 'Get a doctor by id' })
  getDoctorDetailsById(
    @Request() req,
    // @Param('doctorId') doctorId: string
  ) {
    return this.doctorService.getDoctorDetailsById(req.user.sub);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all doctors' })
  getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @Get('patients')
  @ApiOperation({ summary: 'Get all a doctor patients' })
  getDoctorPatients(
    @Request() req,
    // @Param('doctorId') doctorId: string
  ) {
    return this.doctorService.getDoctorPatients(req.user.sub);
  }

  @Patch('')
  @ApiOperation({ summary: 'Update a doctor details' })
  updateDoctorDetails(
    @Request() req,
    // @Param('doctorId') doctorId: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctorDetails(req.user.sub, dto);
  }
}
