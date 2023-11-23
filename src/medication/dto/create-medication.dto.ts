import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  medicationName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  diagnosis: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  timesToBeTaken: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  dosage: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  durationInHours: number;
}
